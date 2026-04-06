import api from '@/lib/axios'
import type { LatestReading } from '@/types/reading'

export async function getLatestReadings(): Promise<LatestReading[]> {
  const res = await api.get<LatestReading[]>('/readings/latest')
  return res.data
}
