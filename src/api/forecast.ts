import api from '@/lib/axios'
import type { ForecastDevice, ForecastRequest, ForecastResponse } from '@/types/forecast'

export async function getForecastDevices(): Promise<ForecastDevice[]> {
  const res = await api.get<ForecastDevice[]>('/forecast/devices')
  return res.data
}

export async function predictForecast(body: ForecastRequest): Promise<ForecastResponse> {
  const res = await api.post<ForecastResponse>('/forecast/predict', body)
  return res.data
}
