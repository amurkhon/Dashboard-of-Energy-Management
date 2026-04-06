/**
 * Starts the browser-side simulation loop.
 * Call this once at the app root (e.g. inside App.tsx).
 * Every 3 seconds it generates a new snapshot and pushes it into:
 *  - simStore  (for dashboard KPIs and the time-series chart)
 *  - wsStore   (so any component reading liveReadings still works)
 */
import { useEffect } from 'react'
import { generateSnapshot } from '@/simulation/deviceSimulator'
import { useSimStore } from '@/store/simStore'
import { useWsStore } from '@/store/wsStore'

const TICK_MS = 3_000

export function useLocalSimulation() {
  const addSnapshot  = useSimStore((s) => s._addSnapshot)
  const setRunning   = useSimStore((s) => s.setRunning)
  const updateReading = useWsStore((s) => s.updateReading)

  useEffect(() => {
    setRunning(true)

    const tick = () => {
      const snap = generateSnapshot()
      addSnapshot(snap)

      // Also feed into wsStore so LiveReading-based components work
      for (const r of snap.readings) {
        updateReading({
          device_id:      r.deviceId,
          device_name:    r.deviceName,
          power_kw:       r.powerKw,
          energy_kwh:     r.powerKw * (3 / 3600),
          state_of_charge: r.stateOfCharge ?? null,
          temperature_c:  null,
          recorded_at:    snap.timestamp,
        })
      }
    }

    // Fire immediately so UI isn't blank
    tick()
    const id = setInterval(tick, TICK_MS)

    return () => {
      clearInterval(id)
      setRunning(false)
    }
  }, [addSnapshot, setRunning, updateReading])
}
