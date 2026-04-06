import api from '@/lib/axios'
import type {
  EfficiencyScoreResponse,
  DeviceEfficiencyScore,
  EfficiencyHistoryResponse,
} from '@/types/efficiency'

export async function getEfficiencyScore(hours = 24): Promise<EfficiencyScoreResponse> {
  const res = await api.get<EfficiencyScoreResponse>('/efficiency/score', { params: { hours } })
  return res.data
}

export async function getDeviceEfficiencyScore(
  deviceId: string,
  hours = 24,
): Promise<DeviceEfficiencyScore> {
  const res = await api.get<DeviceEfficiencyScore>(`/efficiency/score/${deviceId}`, {
    params: { hours },
  })
  return res.data
}

export async function getEfficiencyHistory(
  days = 7,
  deviceId?: string,
): Promise<EfficiencyHistoryResponse> {
  const res = await api.get<EfficiencyHistoryResponse>('/efficiency/history', {
    params: { days, ...(deviceId ? { device_id: deviceId } : {}) },
  })
  return res.data
}

export async function triggerEfficiencyAnalysis(): Promise<{ message: string; user_id: string }> {
  const res = await api.post('/efficiency/analyze')
  return res.data
}
