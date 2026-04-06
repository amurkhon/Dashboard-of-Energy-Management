import { QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (count, error) => {
        const axiosError = error as AxiosError
        if (axiosError?.response?.status === 401) return false
        if (axiosError?.response?.status === 403) return false
        return count < 2
      },
    },
  },
})
