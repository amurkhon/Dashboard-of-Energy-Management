export interface ForecastDevice {
  device_id: string
  name: string
  device_type: string
  model_trained: boolean
}

export interface HorizonPrediction {
  horizon: string
  predicted_kwh: number
  lower_kwh: number
  upper_kwh: number
  estimated_cost_flat: number
  estimated_cost_tou: number
  model: 'gbm' | 'analytical'
}

export interface ForecastResponse {
  device_id: string | null
  device_name: string
  target_datetime: string
  features_used: {
    hour_of_day: number
    day_of_week: number
    is_weekend: number
    temperature_c: number
    lag_1h: number
    lag_24h: number
    lag_168h: number
  }
  predictions: HorizonPrediction[]
  model_trained: boolean
}

export interface ForecastRequest {
  device_id?: string
  target_datetime: string   // ISO string
  temperature_c: number
  current_power_kw?: number
  horizons: Array<'1h' | '6h' | '24h' | '7d'>
}
