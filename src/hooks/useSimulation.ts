import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSimulationStatus, getSimulationSessions, createSimulationSession,
  pauseSession, resumeSession, stopSession,
} from '@/api/simulation'
import { QK } from '@/api/queryKeys'
import type { SimSessionCreate } from '@/types/simulation'

export function useSimulationStatus() {
  return useQuery({
    queryKey: QK.simulationStatus,
    queryFn: getSimulationStatus,
    staleTime: 5_000,
    refetchInterval: 10_000,
  })
}

export function useSimulationSessions() {
  return useQuery({
    queryKey: QK.simulationSessions,
    queryFn: getSimulationSessions,
  })
}

export function useCreateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SimSessionCreate) => createSimulationSession(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.simulationStatus })
      qc.invalidateQueries({ queryKey: QK.simulationSessions })
    },
  })
}

export function usePauseSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => pauseSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.simulationStatus }),
  })
}

export function useResumeSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => resumeSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.simulationStatus }),
  })
}

export function useStopSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => stopSession(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.simulationStatus })
      qc.invalidateQueries({ queryKey: QK.simulationSessions })
    },
  })
}
