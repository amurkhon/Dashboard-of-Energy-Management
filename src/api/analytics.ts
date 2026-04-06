import api from '@/lib/axios'
import type {
  ConsumptionBucket,
  ProductionBucket,
  EfficiencyStats,
  CostEstimate,
  HeatmapCell,
  Granularity,
  TariffType,
} from '@/types/analytics'

export async function getConsumption(params: {
  from_dt?: string
  to_dt?: string
  granularity?: Granularity
  device_id?: string
}): Promise<ConsumptionBucket[]> {
  const res = await api.get<ConsumptionBucket[]>('/analytics/consumption', { params })
  return res.data
}

export async function getProduction(params: {
  from_dt?: string
  to_dt?: string
  granularity?: Granularity
}): Promise<ProductionBucket[]> {
  const res = await api.get<ProductionBucket[]>('/analytics/production', { params })
  return res.data
}

export async function getEfficiency(params: {
  from_dt?: string
  to_dt?: string
}): Promise<EfficiencyStats> {
  const res = await api.get<EfficiencyStats>('/analytics/efficiency', { params })
  return res.data
}

export async function getCost(params: {
  from_dt?: string
  to_dt?: string
  tariff_type?: TariffType
}): Promise<CostEstimate> {
  const res = await api.get<CostEstimate>('/analytics/cost', { params })
  return res.data
}

export async function getHeatmap(params: {
  from_dt?: string
  to_dt?: string
}): Promise<HeatmapCell[]> {
  const res = await api.get<HeatmapCell[]>('/analytics/heatmap', { params })
  return res.data
}
