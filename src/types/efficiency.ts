export interface DeviceEfficiencyScore {
  device_id: string
  device_name: string
  device_type: string
  profile: string
  efficiency_score: number | null
  label: string
  confidence: number
  model_used: string
  readings_count: number
  period_hours?: number
}

export interface EfficiencyScoreResponse {
  timestamp: string
  period_hours: number
  overall_score: number | null
  overall_label: string
  device_count: number
  devices: DeviceEfficiencyScore[]
}

export interface EfficiencyHistoryEntry {
  date: string
  efficiency_score: number
  label: string
}

export interface EfficiencyHistoryResponse {
  device_count: number
  days: number
  history: EfficiencyHistoryEntry[]
}
