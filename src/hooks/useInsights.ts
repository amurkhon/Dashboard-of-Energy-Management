import { useQuery } from '@tanstack/react-query'
import { getInsights } from '@/api/insights'

export function useInsights(hours = 24) {
  return useQuery({
    queryKey: ['insights', hours],
    queryFn: () => getInsights(hours),
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
}
