import { useQuery } from '@tanstack/react-query'
import { getConsumption, getProduction, getEfficiency, getCost, getHeatmap } from '@/api/analytics'
import { QK } from '@/api/queryKeys'
import type { Granularity, TariffType } from '@/types/analytics'

interface DateRange {
  from_dt?: string
  to_dt?: string
}

export function useConsumption(params: DateRange & { granularity?: Granularity; device_id?: string }) {
  return useQuery({
    queryKey: QK.consumption(params),
    queryFn: () => getConsumption(params),
  })
}

export function useProduction(params: DateRange & { granularity?: Granularity }) {
  return useQuery({
    queryKey: QK.production(params),
    queryFn: () => getProduction(params),
  })
}

export function useEfficiency(params: DateRange) {
  return useQuery({
    queryKey: QK.efficiency(params),
    queryFn: () => getEfficiency(params),
  })
}

export function useCost(params: DateRange & { tariff_type?: TariffType }) {
  return useQuery({
    queryKey: QK.cost(params),
    queryFn: () => getCost(params),
  })
}

export function useHeatmap(params: DateRange) {
  return useQuery({
    queryKey: QK.heatmap(params),
    queryFn: () => getHeatmap(params),
    staleTime: 300_000,
  })
}
