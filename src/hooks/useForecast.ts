import { useQuery, useMutation } from '@tanstack/react-query'
import { getForecastDevices, predictForecast } from '@/api/forecast'
import type { ForecastRequest } from '@/types/forecast'

export function useForecastDevices() {
  return useQuery({
    queryKey: ['forecast', 'devices'],
    queryFn: getForecastDevices,
    staleTime: 60_000,
  })
}

export function usePredictForecast() {
  return useMutation({
    mutationFn: (body: ForecastRequest) => predictForecast(body),
  })
}
