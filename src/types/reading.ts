export interface ReadingOut {
  id: string
  device_id: string
  recorded_at: string
  power_kw: number
  energy_kwh: number
  voltage_v: number | null
  current_a: number | null
  frequency_hz: number | null
  power_factor: number | null
  state_of_charge: number | null
  temperature_c: number | null
  metadata: Record<string, unknown>
}

export interface LatestReading {
  device_id: string
  device_name: string
  device_type: string
  power_kw: number
  energy_kwh: number
  state_of_charge: number | null
  temperature_c: number | null
  recorded_at: string
}
