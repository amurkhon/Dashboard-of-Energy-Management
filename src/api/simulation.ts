import api from '@/lib/axios'
import type { SimSessionOut, SimSessionCreate, SimStatusResponse } from '@/types/simulation'

export async function getSimulationStatus(): Promise<SimStatusResponse> {
  const res = await api.get<SimStatusResponse>('/simulation/status')
  return res.data
}

export async function getSimulationSessions(): Promise<SimSessionOut[]> {
  const res = await api.get<SimSessionOut[]>('/simulation/sessions')
  return res.data
}

export async function createSimulationSession(data: SimSessionCreate): Promise<SimSessionOut> {
  const res = await api.post<SimSessionOut>('/simulation/sessions', data)
  return res.data
}

export async function pauseSession(id: string): Promise<SimSessionOut> {
  const res = await api.put<SimSessionOut>(`/simulation/sessions/${id}/pause`)
  return res.data
}

export async function resumeSession(id: string): Promise<SimSessionOut> {
  const res = await api.put<SimSessionOut>(`/simulation/sessions/${id}/resume`)
  return res.data
}

export async function stopSession(id: string): Promise<SimSessionOut> {
  const res = await api.put<SimSessionOut>(`/simulation/sessions/${id}/stop`)
  return res.data
}
