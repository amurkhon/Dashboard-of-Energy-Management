import type { SuggestionOut } from './suggestion'

export interface DashboardResponse {
  total_power_kw: number
  today_kwh: number
  renewable_pct: number
  critical_alerts_count: number
  battery_soc: number | null
  top_suggestions: SuggestionOut[]
}
