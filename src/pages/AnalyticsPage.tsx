import { useState } from 'react'
import { subDays, formatISO } from 'date-fns'
import { useConsumption, useProduction, useEfficiency, useCost, useHeatmap } from '@/hooks/useAnalytics'
import { ConsumptionProductionChart } from '@/components/charts/ConsumptionProductionChart'
import { CostComparisonChart } from '@/components/charts/CostComparisonChart'
import { UsageHeatmap } from '@/components/charts/UsageHeatmap'
import { EfficiencyCards } from '@/components/analytics/EfficiencyCards'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Granularity } from '@/types/analytics'

const GRANULARITIES: { value: Granularity; label: string }[] = [
  { value: 'hour', label: 'Hourly' },
  { value: 'day', label: 'Daily' },
  { value: 'week', label: 'Weekly' },
]

const RANGES = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
]

export function AnalyticsPage() {
  const [rangeDays, setRangeDays] = useState(7)
  const [granularity, setGranularity] = useState<Granularity>('day')

  const to_dt = formatISO(new Date())
  const from_dt = formatISO(subDays(new Date(), rangeDays))
  const params = { from_dt, to_dt, granularity }

  const consumption = useConsumption(params)
  const production = useProduction({ from_dt, to_dt, granularity })
  const efficiency = useEfficiency({ from_dt, to_dt })
  const costFlat = useCost({ from_dt, to_dt, tariff_type: 'flat' })
  const costTou = useCost({ from_dt, to_dt, tariff_type: 'tou' })
  const heatmap = useHeatmap({ from_dt, to_dt })

  return (
    <PageShell title="Analytics" subtitle="Energy trends and cost analysis">
      {/* Range + Granularity Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          {RANGES.map(({ label, days }) => (
            <button
              key={days}
              onClick={() => setRangeDays(days)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                rangeDays === days
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          {GRANULARITIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setGranularity(value)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                granularity === value
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Efficiency Cards */}
      {efficiency.data ? (
        <EfficiencyCards stats={efficiency.data} />
      ) : (
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      )}

      {/* Consumption / Production Chart */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700">Consumption vs Production</h2>
        </CardHeader>
        <CardBody>
          {consumption.isPending || production.isPending ? (
            <Skeleton className="h-72" />
          ) : (
            <ConsumptionProductionChart
              consumption={consumption.data ?? []}
              production={production.data ?? []}
            />
          )}
        </CardBody>
      </Card>

      {/* Cost Comparison */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700">Cost Comparison (Flat vs Time-of-Use)</h2>
        </CardHeader>
        <CardBody>
          {costFlat.isPending || costTou.isPending ? (
            <Skeleton className="h-48" />
          ) : (
            <CostComparisonChart flat={costFlat.data} tou={costTou.data} />
          )}
        </CardBody>
      </Card>

      {/* Usage Heatmap */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700">Usage Heatmap (Hour × Day)</h2>
        </CardHeader>
        <CardBody>
          {heatmap.isPending ? (
            <Skeleton className="h-48" />
          ) : (
            <UsageHeatmap data={heatmap.data ?? []} />
          )}
        </CardBody>
      </Card>
    </PageShell>
  )
}
