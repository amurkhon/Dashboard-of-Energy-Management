export type AlertSeverity = 'info' | 'warning' | 'critical'
export type AlertOperator = '>' | '<' | '>=' | '<=' | '=='
export type AlertMetric = 'power_kw' | 'energy_kwh' | 'state_of_charge' | 'temperature_c'

export interface AlertRuleOut {
  id: string
  user_id: string
  device_id: string | null
  metric: AlertMetric
  operator: AlertOperator
  threshold: number
  severity: AlertSeverity
  cooldown_minutes: number
  is_active: boolean
  name: string
  created_at: string
}

export interface AlertRuleCreate {
  name: string
  device_id?: string
  metric: AlertMetric
  operator: AlertOperator
  threshold: number
  severity: AlertSeverity
  cooldown_minutes?: number
}

export interface AlertEventOut {
  id: string
  rule_id: string
  device_id: string | null
  device_name: string | null
  triggered_at: string
  actual_value: number
  threshold_value: number
  severity: AlertSeverity
  metric: AlertMetric
  is_acknowledged: boolean
  acknowledged_at: string | null
  rule_name: string
}
