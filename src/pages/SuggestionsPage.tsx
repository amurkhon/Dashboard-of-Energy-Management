import { useState } from 'react'
import { RefreshCw, X, Check } from 'lucide-react'
import { useSuggestions, useSuggestionSummary, useDismissSuggestion, useApplySuggestion, useGenerateSuggestions } from '@/hooks/useSuggestions'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency, formatKwh, formatRelativeTime } from '@/lib/utils'
import type { SuggestionCategory, SuggestionPriority } from '@/types/suggestion'

const CATEGORIES: Array<{ value: SuggestionCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'anomaly', label: 'Anomaly' },
  { value: 'load_shifting', label: 'Load Shifting' },
  { value: 'renewable', label: 'Renewable' },
  { value: 'efficiency', label: 'Efficiency' },
  { value: 'forecast', label: 'Forecast' },
]

const priorityVariant: Record<SuggestionPriority, 'critical' | 'high' | 'medium' | 'low'> = {
  critical: 'critical', high: 'high', medium: 'medium', low: 'low',
}

export function SuggestionsPage() {
  const [category, setCategory] = useState<SuggestionCategory | 'all'>('all')
  const { data: suggestions, isPending } = useSuggestions(
    category !== 'all' ? { category } : undefined
  )
  const { data: summary } = useSuggestionSummary()
  const dismiss = useDismissSuggestion()
  const apply = useApplySuggestion()
  const generate = useGenerateSuggestions()

  const filtered = (suggestions ?? []).filter((s) => !s.is_dismissed && !s.is_applied)

  return (
    <PageShell
      title="AI Suggestions"
      subtitle={`${filtered.length} active suggestion${filtered.length !== 1 ? 's' : ''}`}
      actions={
        <Button
          size="sm"
          variant="secondary"
          loading={generate.isPending}
          onClick={() => generate.mutate()}
        >
          <RefreshCw size={14} /> Generate
        </Button>
      }
    >
      {/* Summary Bar */}
      {summary && (
        <div className="flex flex-wrap gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <div>
            <p className="text-xs text-green-700">Total Suggestions</p>
            <p className="text-xl font-bold text-green-800">{summary.total_active}</p>
          </div>
          <div>
            <p className="text-xs text-green-700">Potential Savings (Energy)</p>
            <p className="text-xl font-bold text-green-800">{formatKwh(summary.estimated_total_saving_kwh)}</p>
          </div>
          <div>
            <p className="text-xs text-green-700">Potential Savings (Cost)</p>
            <p className="text-xl font-bold text-green-800">{formatCurrency(summary.estimated_total_saving_cost)}</p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              category === value
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Suggestion Cards */}
      <div className="space-y-3">
        {isPending ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : !filtered.length ? (
          <Card>
            <CardBody className="py-8 text-center text-sm text-gray-400">
              No active suggestions in this category.
            </CardBody>
          </Card>
        ) : (
          filtered.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant={priorityVariant[s.priority]}>{s.priority}</Badge>
                  <Badge variant="neutral">{s.category}</Badge>
                  <span className="text-sm font-semibold text-gray-800">{s.title}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => apply.mutate(s.id)}
                    title="Apply"
                  >
                    <Check size={14} className="text-green-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dismiss.mutate(s.id)}
                    title="Dismiss"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600">{s.description}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                  {s.estimated_saving_kwh != null && (
                    <span className="text-green-600 font-medium">
                      Save {formatKwh(s.estimated_saving_kwh)}
                    </span>
                  )}
                  {s.estimated_saving_cost != null && (
                    <span className="text-green-600 font-medium">
                      {formatCurrency(s.estimated_saving_cost)}
                    </span>
                  )}
                  {s.confidence_score != null && (
                    <span>Confidence: {(s.confidence_score * 100).toFixed(0)}%</span>
                  )}
                  {s.device_name && <span>Device: {s.device_name}</span>}
                  <span>{formatRelativeTime(s.generated_at)}</span>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </PageShell>
  )
}
