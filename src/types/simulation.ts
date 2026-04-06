export type SimSessionStatus = 'running' | 'paused' | 'stopped' | 'completed' | 'error'

export interface SimSessionOut {
  id: string
  user_id: string
  status: SimSessionStatus
  sim_speed: number
  started_at: string
  paused_at: string | null
  stopped_at: string | null
  config: Record<string, unknown>
  tick_count: number
  current_sim_time: string | null
}

export interface SimSessionCreate {
  device_ids: string[]
  sim_speed?: number
  config?: Record<string, unknown>
}

export interface SimStatusResponse {
  running: boolean
  session: SimSessionOut | null
}
