import { Lightbulb, X, Check } from 'lucide-react'
import { useSuggestions, useDismissSuggestion, useApplySuggestion } from '@/hooks/useSuggestions'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatKwh } from '@/lib/utils'
import type { SuggestionPriority } from '@/types/suggestion'

const priorityVariant: Record<SuggestionPriority, 'critical' | 'high' | 'medium' | 'low'> = {
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
}

export function SuggestionFeed() {
  const { data: suggestions } = useSuggestions()
  const dismiss = useDismissSuggestion()
  const apply = useApplySuggestion()

  const topSuggestions = (suggestions ?? [])
    .filter((s) => !s.is_dismissed && !s.is_applied)
    .slice(0, 3)

  if (topSuggestions.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Lightbulb size={16} />
        No active suggestions
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {topSuggestions.map((s) => (
        <div
          key={s.id}
          className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant={priorityVariant[s.priority]}>{s.priority}</Badge>
              <span className="truncate text-sm font-medium text-gray-800">{s.title}</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>
            {(s.estimated_saving_cost != null || s.estimated_saving_kwh != null) && (
              <p className="mt-1 text-xs text-green-600 font-medium">
                Save{s.estimated_saving_kwh != null ? ` ${formatKwh(s.estimated_saving_kwh)}` : ''}
                {s.estimated_saving_cost != null ? ` · ${formatCurrency(s.estimated_saving_cost)}` : ''}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => apply.mutate(s.id)}
              className="rounded-md p-1 text-green-600 hover:bg-green-100"
              title="Apply"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => dismiss.mutate(s.id)}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-200"
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
