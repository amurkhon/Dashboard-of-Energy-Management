/**
 * Frontend simulation engine.
 * Generates realistic energy readings for 7 device types based on
 * the current time of day. Mirrors the backend simulation logic so
 * the UI can run without Celery / real devices.
 */

export interface DeviceReading {
  deviceId: string
  deviceName: string
  deviceType: string
  powerKw: number          // positive = production, negative = consumption
  stateOfCharge?: number   // 0–100 for battery
}

export interface SimSnapshot {
  timestamp: string        // ISO string
  readings: DeviceReading[]
  solarKw: number
  batteryKw: number
  batterySoc: number
  totalConsumptionKw: number   // absolute sum of all consumers
  totalProductionKw: number    // sum of generators
  netKw: number                // production - consumption (positive = surplus)
  renewablePct: number         // 0–100
  todayKwh: number             // cumulative consumption today (kWh)
}

// --- helpers ---

function noise(amplitude: number): number {
  return (Math.random() - 0.5) * 2 * amplitude
}

/** Returns a value slowly drifting toward target with bounded noise. */
function drift(current: number, target: number, speed = 0.15, jitter = 0.05): number {
  return current + (target - current) * speed + noise(jitter)
}

// --- mutable internal state (resets at midnight) ---

let _batterySoc = 60 + Math.random() * 20   // start 60–80%
let _applianceOn = false
let _applianceTicksLeft = 0
let _hvacDrift = 2.8
let _todayKwh = 0
let _lastMidnight = new Date().setHours(0, 0, 0, 0)

const TICK_HOURS = 3 / 3600  // 3-second tick in hours

// --- individual device generators ---

function solar(hour: number): number {
  if (hour < 6 || hour > 19) return 0
  const angle = Math.PI * (hour - 6) / 13
  const base = Math.max(0, Math.sin(angle)) * 5.0
  const cloud = 0.65 + Math.random() * 0.35    // random cloud factor
  return Math.max(0, base * cloud + noise(0.08))
}

function hvac(hour: number): number {
  // Higher demand morning (7–9) and evening (17–20), lower overnight
  const peakFactor =
    (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20) ? 1.3 :
    (hour >= 1 && hour <= 5) ? 0.5 : 1.0
  const target = 2.5 * peakFactor
  _hvacDrift = drift(_hvacDrift, target, 0.1, 0.04)
  return -Math.max(0.4, _hvacDrift)
}

function lighting(hour: number): number {
  const base = (hour >= 7 && hour <= 17) ? 0.08 : 0.42
  return -(base + Math.abs(noise(0.04)))
}

function evCharger(hour: number): number {
  const active = hour >= 22 || hour < 7
  if (!active) return 0
  return -(7.4 + noise(0.15))
}

function appliance(): number {
  // Washer runs in ~20-minute cycles, triggered randomly
  if (_applianceOn) {
    _applianceTicksLeft--
    if (_applianceTicksLeft <= 0) _applianceOn = false
    return -(1.8 + noise(0.2))
  }
  // 1% chance to start each tick
  if (Math.random() < 0.01) {
    _applianceOn = true
    _applianceTicksLeft = Math.round(20 * 60 / 3)   // 20 min at 3s/tick
  }
  return 0
}

function battery(netWithoutBattery: number): number {
  // Battery tries to buffer the grid: charge when surplus, discharge when deficit
  const desired = -netWithoutBattery
  const clamped = Math.max(-5.0, Math.min(5.0, desired))

  // Hard SoC limits
  if (clamped > 0 && _batterySoc >= 99) return 0   // already full
  if (clamped < 0 && _batterySoc <= 2) return 0    // already empty

  // Update SoC
  _batterySoc = Math.min(100, Math.max(0, _batterySoc + (clamped * TICK_HOURS / 13.5) * 100))
  return clamped + noise(0.05)
}

// --- public API ---

/** Generate one simulation tick. Returns a full snapshot. */
export function generateSnapshot(): SimSnapshot {
  const now = new Date()
  const midnight = new Date(now).setHours(0, 0, 0, 0)

  // Reset daily accumulator at midnight
  if (midnight !== _lastMidnight) {
    _todayKwh = 0
    _lastMidnight = midnight
  }

  const hour = now.getHours() + now.getMinutes() / 60

  const solarKw  = solar(hour)
  const hvacKw   = hvac(hour)
  const lightKw  = lighting(hour)
  const evKw     = evCharger(hour)
  const applKw   = appliance()

  const netWithoutBattery = solarKw + hvacKw + lightKw + evKw + applKw
  const battKw = battery(netWithoutBattery)
  const netKw  = netWithoutBattery + battKw

  const totalConsumptionKw = Math.abs(hvacKw) + Math.abs(lightKw) + Math.abs(evKw) + Math.abs(applKw)
  const totalProductionKw  = solarKw
  const renewablePct = totalConsumptionKw > 0
    ? Math.min(100, (totalProductionKw / totalConsumptionKw) * 100)
    : 0

  // Accumulate today's consumption
  _todayKwh += totalConsumptionKw * TICK_HOURS

  const readings: DeviceReading[] = [
    { deviceId: 'sim-solar',    deviceName: 'Solar Array',   deviceType: 'solar_panel', powerKw: solarKw },
    { deviceId: 'sim-battery',  deviceName: 'Battery Pack',  deviceType: 'battery',     powerKw: battKw, stateOfCharge: _batterySoc },
    { deviceId: 'sim-hvac',     deviceName: 'HVAC',          deviceType: 'hvac',        powerKw: hvacKw },
    { deviceId: 'sim-lighting', deviceName: 'Lighting',      deviceType: 'lighting',    powerKw: lightKw },
    { deviceId: 'sim-ev',       deviceName: 'EV Charger',    deviceType: 'ev_charger',  powerKw: evKw },
    { deviceId: 'sim-washer',   deviceName: 'Washer',        deviceType: 'appliance',   powerKw: applKw },
  ]

  return {
    timestamp: now.toISOString(),
    readings,
    solarKw,
    batteryKw: battKw,
    batterySoc: _batterySoc,
    totalConsumptionKw,
    totalProductionKw,
    netKw,
    renewablePct,
    todayKwh: _todayKwh,
  }
}
