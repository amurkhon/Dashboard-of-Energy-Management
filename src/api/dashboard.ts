import api from '@/lib/axios'
import type { DashboardResponse } from '@/types/dashboard'

export async function getDashboard(): Promise<DashboardResponse> {
  const res = await api.get<DashboardResponse>('/dashboard')
  return res.data
}
