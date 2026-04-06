import { Zap, BatteryCharging, Sun, AlertTriangle } from 'lucide-react'
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
  const { data, isPending } = useDashboard()

  return (
    <PageShell title="Dashboard" subtitle="Real-time energy overview">
      {/* Alert Banner */}
      <AlertBanner />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {isPending ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              label="Total Power"
              value={formatKw(data?.total_power_kw ?? 0)}
              icon={Zap}
              iconColor="text-green-600"
              iconBg="bg-green-50"
              subtitle="Current draw"
            />
            <KpiCard
              label="Today's Energy"
              value={formatKwh(data?.today_kwh ?? 0)}
              icon={BatteryCharging}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              subtitle="Consumed today"
            />
            <KpiCard
              label="Renewable"
              value={formatPercent((data?.renewable_pct ?? 0) / 100)}
              icon={Sun}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
              subtitle="Of total generation"
            />
            <KpiCard
              label="Critical Alerts"
              value={String(data?.critical_alerts_count ?? 0)}
              icon={AlertTriangle}
              iconColor={data?.critical_alerts_count ? 'text-red-600' : 'text-gray-400'}
              iconBg={data?.critical_alerts_count ? 'bg-red-50' : 'bg-gray-50'}
              subtitle="Unacknowledged"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Live Power Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-700">Live Device Power</h2>
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
            <GaugeChart value={data?.battery_soc ?? 0} label="Battery SoC" size={160} />
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
