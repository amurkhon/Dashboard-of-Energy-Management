import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAlertEvents, acknowledgeAlert,
  getAlertRules, createAlertRule, updateAlertRule, deleteAlertRule,
} from '@/api/alerts'
import { QK } from '@/api/queryKeys'
import type { AlertRuleCreate, AlertSeverity } from '@/types/alert'
import type { AlertEventOut } from '@/types/alert'

export function useAlertEvents(filters?: { severity?: AlertSeverity; acknowledged?: boolean }) {
  return useQuery({
    queryKey: QK.alerts(filters),
    queryFn: () => getAlertEvents(filters),
    staleTime: 10_000,
    refetchInterval: 15_000,
  })
}

export function useAcknowledgeAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => acknowledgeAlert(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['alerts'] })
      const snapshot = qc.getQueryData<AlertEventOut[]>(QK.alerts())
      qc.setQueryData<AlertEventOut[]>(QK.alerts(), (old) =>
        old?.map((a) => (a.id === id ? { ...a, is_acknowledged: true } : a)) ?? []
      )
      return { snapshot }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(QK.alerts(), ctx.snapshot)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['alerts'] })
      qc.invalidateQueries({ queryKey: QK.dashboard })
    },
  })
}

export function useAlertRules() {
  return useQuery({ queryKey: QK.alertRules, queryFn: getAlertRules })
}

export function useCreateAlertRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AlertRuleCreate) => createAlertRule(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.alertRules }),
  })
}

export function useUpdateAlertRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AlertRuleCreate> }) => updateAlertRule(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.alertRules }),
  })
}

export function useDeleteAlertRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAlertRule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.alertRules }),
  })
}
