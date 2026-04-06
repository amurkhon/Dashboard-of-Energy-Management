import type { AlertEventOut } from './alert'

export interface LiveReading {
  device_id: string
  device_name: string
  power_kw: number
  energy_kwh: number
  state_of_charge: number | null
  temperature_c: number | null
  recorded_at: string
}

export interface SimTick {
  session_id: string
  sim_time: string
  tick: number
}

export type WsMessage =
  | { type: 'reading'; payload: LiveReading }
  | { type: 'alert'; payload: AlertEventOut }
  | { type: 'sim_tick'; payload: SimTick }
  | { type: 'pong' }
  | { type: 'error'; message: string }
