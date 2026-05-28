import api from '@/lib/axios'
import type { InsightsResponse } from '@/types/insights'

export async function getInsights(hours = 24): Promise<InsightsResponse> {
  const res = await api.get<InsightsResponse>('/insights', { params: { hours } })
  return res.data
}
