export type SuggestionPriority = 'low' | 'medium' | 'high' | 'critical'
export type SuggestionCategory = 'anomaly' | 'load_shifting' | 'renewable' | 'efficiency' | 'forecast'
export type SuggestionSource = 'rule_based' | 'ml_anomaly' | 'ml_forecast' | 'ml_optimization'

export interface SuggestionOut {
  id: string
  user_id: string
  device_id: string | null
  device_name: string | null
  generated_at: string
  expires_at: string | null
  category: SuggestionCategory
  priority: SuggestionPriority
  title: string
  description: string
  action_detail: Record<string, unknown> | null
  estimated_saving_kwh: number | null
  estimated_saving_cost: number | null
  confidence_score: number | null
  source: SuggestionSource
  is_dismissed: boolean
  is_applied: boolean
  dismissed_at: string | null
  applied_at: string | null
}

export interface SuggestionSummary {
  total_active: number
  critical: number
  high: number
  medium: number
  low: number
  estimated_total_saving_kwh: number
  estimated_total_saving_cost: number
}
