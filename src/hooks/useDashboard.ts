import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '@/api/dashboard'
import { QK } from '@/api/queryKeys'

export function useDashboard() {
  return useQuery({
    queryKey: QK.dashboard,
    queryFn: getDashboard,
    staleTime: 10_000,
    refetchInterval: 30_000,
  })
}
