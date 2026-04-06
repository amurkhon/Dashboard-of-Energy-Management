import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEfficiencyScore,
  getDeviceEfficiencyScore,
  getEfficiencyHistory,
  triggerEfficiencyAnalysis,
} from '@/api/efficiency'
import { QK } from '@/api/queryKeys'

export function useEfficiencyScore(hours = 24) {
  return useQuery({
    queryKey: QK.efficiencyScore(hours),
    queryFn: () => getEfficiencyScore(hours),
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
}

export function useDeviceEfficiencyScore(deviceId: string | undefined, hours = 24) {
  return useQuery({
    queryKey: QK.deviceEfficiencyScore(deviceId!, hours),
    queryFn: () => getDeviceEfficiencyScore(deviceId!, hours),
    enabled: !!deviceId,
    staleTime: 60_000,
  })
}

export function useEfficiencyHistory(days = 7, deviceId?: string) {
  return useQuery({
    queryKey: QK.efficiencyHistory(days, deviceId),
    queryFn: () => getEfficiencyHistory(days, deviceId),
    staleTime: 300_000,
  })
}

export function useTriggerEfficiencyAnalysis() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: triggerEfficiencyAnalysis,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['efficiency'] })
      qc.invalidateQueries({ queryKey: QK.dashboard })
    },
  })
}
