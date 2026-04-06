import { Zap, BatteryCharging, Sun, AlertTriangle, Gauge } from 'lucide-react'
import { useSimStore } from '@/store/simStore'
import { useDashboard } from '@/hooks/useDashboard'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { AlertBanner } from '@/components/dashboard/AlertBanner'
import { SuggestionFeed } from '@/components/dashboard/SuggestionFeed'
import { LivePowerChart } from '@/components/charts/LivePowerChart'
import { GaugeChart } from '@/components/charts/GaugeChart'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { PageShell } from '@/components/layout/PageShell'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { formatKw, formatKwh, formatPercent } from '@/lib/utils'

export function DashboardPage() {
  const sim = useSimStore((s) => s.current)
  // Still fetch backend data for suggestions and alerts count
  const { data: apiData } = useDashboard()

  const isReady = sim !== null

  return (
    <PageShell title="Dashboard" subtitle="Real-time energy overview">
      {/* Alert Banner */}
      <AlertBanner />

      {/* KPI Cards — live values from simulation */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {!isReady ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              label="Net Power"
              value={formatKw(sim.netKw)}
              icon={Zap}
              iconColor={sim.netKw >= 0 ? 'text-green-600' : 'text-red-500'}
              iconBg={sim.netKw >= 0 ? 'bg-green-50' : 'bg-red-50'}
              subtitle={sim.netKw >= 0 ? 'Surplus to grid' : 'Drawing from grid'}
            />
            <KpiCard
              label="Today's Energy"
              value={formatKwh(sim.todayKwh)}
              icon={BatteryCharging}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              subtitle="Consumed today"
            />
            <KpiCard
              label="Solar Output"
              value={formatKw(sim.solarKw)}
              icon={Sun}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
              subtitle={`${sim.renewablePct.toFixed(0)}% of consumption`}
            />
            <KpiCard
              label="Critical Alerts"
              value={String(apiData?.critical_alerts ?? 0)}
              icon={AlertTriangle}
              iconColor={apiData?.critical_alerts ? 'text-red-600' : 'text-gray-400'}
              iconBg={apiData?.critical_alerts ? 'bg-red-50' : 'bg-gray-50'}
              subtitle="Unacknowledged"
            />
            <KpiCard
              label="Efficiency Score"
              value={apiData?.efficiency_score != null
                ? String(Math.round(apiData.efficiency_score))
                : '—'}
              icon={Gauge}
              iconColor="text-purple-600"
              iconBg="bg-purple-50"
              subtitle={apiData?.efficiency_label ?? 'unknown'}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Live Power Chart — time-series from simulation */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-700">Live Device Power</h2>
            <span className="flex items-center gap-1.5 text-xs text-green-600">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Live simulation
            </span>
          </CardHeader>
          <CardBody>
            <LivePowerChart />
          </CardBody>
        </Card>

        {/* Battery SoC */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-700">Battery State of Charge</h2>
          </CardHeader>
          <CardBody className="flex items-center justify-center py-4">
            <GaugeChart
              value={sim?.batterySoc ?? 0}
              label="Battery SoC"
              size={160}
            />
          </CardBody>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700">Top AI Suggestions</h2>
        </CardHeader>
        <CardBody>
          <SuggestionFeed />
        </CardBody>
      </Card>
    </PageShell>
  )
}
