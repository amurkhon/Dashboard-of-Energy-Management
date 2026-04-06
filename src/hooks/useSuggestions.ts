import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSuggestions, getSuggestionSummary,
  dismissSuggestion, applySuggestion, generateSuggestions,
} from '@/api/suggestions'
import { QK } from '@/api/queryKeys'
import type { SuggestionOut, SuggestionCategory, SuggestionPriority } from '@/types/suggestion'

export function useSuggestions(filters?: { category?: SuggestionCategory; priority?: SuggestionPriority }) {
  return useQuery({
    queryKey: QK.suggestions(filters),
    queryFn: () => getSuggestions(filters),
  })
}

export function useSuggestionSummary() {
  return useQuery({
    queryKey: QK.suggestionSummary,
    queryFn: getSuggestionSummary,
  })
}

export function useDismissSuggestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => dismissSuggestion(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['suggestions'] })
      const snapshot = qc.getQueryData<SuggestionOut[]>(QK.suggestions())
      qc.setQueryData<SuggestionOut[]>(QK.suggestions(), (old) =>
        old?.filter((s) => s.id !== id) ?? []
      )
      return { snapshot }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(QK.suggestions(), ctx.snapshot)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['suggestions'] })
    },
  })
}

export function useApplySuggestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => applySuggestion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suggestions'] })
    },
  })
}

export function useGenerateSuggestions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: generateSuggestions,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suggestions'] })
    },
  })
}
