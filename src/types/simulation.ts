export type SimSessionStatus = 'running' | 'paused' | 'stopped' | 'completed'

export interface SimSessionOut {
  id: string
  user_id: string
  name: string | null
  status: SimSessionStatus
  sim_start_time: string | null
  sim_speed: number
  tick_interval_s: number
  started_at: string
  paused_at: string | null
  ended_at: string | null
}

export interface SimSessionCreate {
  name?: string | null
  sim_start_time?: string | null
  sim_speed?: number
  tick_interval_s?: number
  device_ids?: string[]
}

export interface SimStatusResponse {
  running: boolean
  session: SimSessionOut | null
}
