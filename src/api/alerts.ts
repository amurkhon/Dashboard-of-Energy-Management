import api from '@/lib/axios'
import type { AlertEventOut, AlertRuleOut, AlertRuleCreate } from '@/types/alert'

export async function getAlertEvents(params?: {
  severity?: string
  unacknowledged?: boolean
  limit?: number
}): Promise<AlertEventOut[]> {
  const res = await api.get<AlertEventOut[]>('/alerts', { params })
  return res.data
}

export async function acknowledgeAlert(id: string): Promise<AlertEventOut> {
  const res = await api.patch<AlertEventOut>(`/alerts/${id}/acknowledge`)
  return res.data
}

export async function getAlertRules(): Promise<AlertRuleOut[]> {
  const res = await api.get<AlertRuleOut[]>('/alert-rules')
  return res.data
}

export async function createAlertRule(data: AlertRuleCreate): Promise<AlertRuleOut> {
  const res = await api.post<AlertRuleOut>('/alert-rules', data)
  return res.data
}

export async function updateAlertRule(id: string, data: Partial<AlertRuleCreate>): Promise<AlertRuleOut> {
  const res = await api.patch<AlertRuleOut>(`/alert-rules/${id}`, data)
  return res.data
}

export async function deleteAlertRule(id: string): Promise<void> {
  await api.delete(`/alert-rules/${id}`)
}
