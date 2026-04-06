export type Granularity = 'hour' | 'day' | 'week'
export type TariffType = 'flat' | 'tou'

export interface ConsumptionBucket {
  timestamp: string
  total_kwh: number
  avg_power_kw: number
  peak_power_kw: number
}

export interface ProductionBucket {
  timestamp: string
  total_kwh: number
  avg_power_kw: number
  device_type: string
}

export interface EfficiencyStats {
  renewable_fraction: number
  self_sufficiency_ratio: number
  net_energy_kwh: number
  total_consumption_kwh: number
  total_production_kwh: number
}

export interface CostEstimate {
  tariff_type: TariffType
  total_cost: number
  total_kwh: number
  currency: string
  breakdown?: {
    peak_kwh?: number
    off_peak_kwh?: number
    peak_cost?: number
    off_peak_cost?: number
  }
}

export interface HeatmapCell {
  hour: number
  day_of_week: number
  avg_kwh: number
  count: number
}
