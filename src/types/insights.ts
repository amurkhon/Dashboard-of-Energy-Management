export interface AnomalyRecord {
  id: string
  device_id: string
  device_name: string
  device_type: string
  anomaly_type: 'spike' | 'dropout' | 'drift' | 'pattern_break'
  expected_value: number | null
  actual_value: number | null
  z_score: number | null
  detected_at: string
}

export interface ForecastPrediction {
  predicted_kwh: number
  lower_bound_kwh: number
  upper_bound_kwh: number
  horizon: string
  model_version: string
}

export interface DeviceForecast {
  device_id: string
  device_name: string
  device_type: string
  predictions: Record<string, ForecastPrediction>
}

export interface RenewableStats {
  fraction: number
  total_production_kwh: number
  total_consumption_kwh: number
  net_kwh: number
  self_sufficiency: number
  producing_devices: number
}

export interface DeviceEfficiency {
  device_id: string
  device_name: string
  device_type: string
  efficiency_score: number | null
  label: string
  confidence: number
  readings_count: number
}

export interface EfficiencySummary {
  overall_score: number | null
  overall_label: string
  devices: DeviceEfficiency[]
}

export interface LoadShiftOpportunity {
  device_id: string
  device_name: string
  title: string
  description: string
  estimated_saving_kwh: number
  estimated_saving_cost: number
  confidence_score: number
  action_detail: {
    recommended_start_hour: number
    recommended_end_hour: number
    current_rate: number
    off_peak_rate: number
  }
}

export interface LoadShiftingSummary {
  current_hour: number
  current_rate_usd_kwh: number
  opportunities: LoadShiftOpportunity[]
  total_potential_saving_usd: number
}

export interface InsightsResponse {
  generated_at: string
  period_hours: number
  device_count: number
  anomalies: AnomalyRecord[]
  forecasts: DeviceForecast[]
  renewable: RenewableStats
  efficiency: EfficiencySummary
  load_shifting: LoadShiftingSummary
}
