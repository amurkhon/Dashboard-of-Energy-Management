import api from '@/lib/axios'
import type { SuggestionOut, SuggestionSummary, SuggestionCategory, SuggestionPriority } from '@/types/suggestion'

export async function getSuggestions(params?: {
  category?: SuggestionCategory
  priority?: SuggestionPriority
  limit?: number
}): Promise<SuggestionOut[]> {
  const res = await api.get<SuggestionOut[]>('/suggestions', { params })
  return res.data
}

export async function getSuggestionSummary(): Promise<SuggestionSummary> {
  const res = await api.get<SuggestionSummary>('/suggestions/summary')
  return res.data
}

export async function dismissSuggestion(id: string): Promise<SuggestionOut> {
  const res = await api.patch<SuggestionOut>(`/suggestions/${id}/dismiss`)
  return res.data
}

export async function applySuggestion(id: string): Promise<SuggestionOut> {
  const res = await api.patch<SuggestionOut>(`/suggestions/${id}/apply`)
  return res.data
}

export async function generateSuggestions(): Promise<{ triggered: boolean }> {
  const res = await api.post<{ triggered: boolean }>('/suggestions/generate')
  return res.data
}
