import type { SuggestionOut } from './suggestion'

export interface DashboardResponse {
  timestamp: string
  total_power_kw: number
  today_kwh: number
  today_renewable_kwh: number
  renewable_pct: number
  battery_soc: number | null
  active_devices: number
  critical_alerts: number
  top_suggestions: SuggestionOut[]
  efficiency_score: number | null
  efficiency_label: string
}
