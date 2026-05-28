import { useState } from 'react'
import { AlertTriangle, TrendingUp, Sun, Gauge, Clock } from 'lucide-react'
import { useInsights } from '@/hooks/useInsights'
import { PageShell } from '@/components/layout/PageShell'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatKwh, formatCurrency, formatRelativeTime, formatPercent } from '@/lib/utils'
import type { AnomalyRecord, DeviceForecast, LoadShiftOpportunity, DeviceEfficiency } from '@/types/insights'

const HOURS_OPTIONS = [
  { label: '6h', value: 6 },
  { label: '24h', value: 24 },
  { label: '48h', value: 48 },
  { label: '7d', value: 168 },
]

const ANOMALY_COLOR: Record<string, string> = {
  spike: 'critical',
  dropout: 'warning',
  drift: 'info',
  pattern_break: 'warning',
}

const EFFICIENCY_COLOR: Record<string, string> = {
  efficient: 'text-green-600',
  good: 'text-blue-600',
  moderate: 'text-amber-600',
  inefficient: 'text-red-500',
  unknown: 'text-gray-400',
}

export function InsightsPage() {
  const [hours, setHours] = useState(24)
  const { data, isPending } = useInsights(hours)

  return (
    <PageShell title="AI Insights" subtitle="Real-time anomaly, forecast, renewable, efficiency & load-shift analysis">
      {/* Period selector */}
      <div className="flex overflow-hidden rounded-lg border border-gray-200 w-fit">
        {HOURS_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setHours(value)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              hours === value ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : !data || data.device_count === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-sm text-gray-400">
            No devices found. Add devices and start a simulation to see AI insights.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">

          {/* ── Anomaly Detection ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                <h2 className="text-sm font-semibold text-gray-700">Anomaly Detection</h2>
                <Badge variant={data.anomalies.length > 0 ? 'critical' : 'neutral'}>
                  {data.anomalies.length} detected
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              {data.anomalies.length === 0 ? (
                <p className="text-sm text-gray-400">No anomalies detected in this period. System is operating normally.</p>
              ) : (
                <div className="space-y-2">
                  {data.anomalies.map((a: AnomalyRecord) => (
                    <div key={a.id} className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="flex items-start gap-3">
                        <Badge variant={ANOMALY_COLOR[a.anomaly_type] as 'critical' | 'warning' | 'info'}>
                          {a.anomaly_type}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{a.device_name}</p>
                          <p className="text-xs text-gray-500">
                            {a.actual_value != null && `Actual: ${a.actual_value.toFixed(2)} kW`}
                            {a.expected_value != null && ` · Expected: ${a.expected_value.toFixed(2)} kW`}
                            {a.z_score != null && ` · Z-score: ${a.z_score.toFixed(1)}σ`}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-gray-400">{formatRelativeTime(a.detected_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* ── Load Shifting ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <h2 className="text-sm font-semibold text-gray-700">Load Shifting Opportunities</h2>
                {data.load_shifting.total_potential_saving_usd > 0 && (
                  <Badge variant="info">
                    Save {formatCurrency(data.load_shifting.total_potential_saving_usd)}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-400">
                Current rate: ${data.load_shifting.current_rate_usd_kwh.toFixed(2)}/kWh at {data.load_shifting.current_hour}:00
              </span>
            </CardHeader>
            <CardBody>
              {data.load_shifting.opportunities.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No load-shifting opportunities right now — you're already in an off-peak window.
                </p>
              ) : (
                <div className="space-y-3">
                  {data.load_shifting.opportunities.map((op: LoadShiftOpportunity) => (
                    <div key={op.device_id} className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800">{op.title}</p>
                        <span className="text-sm font-semibold text-green-700">
                          {formatCurrency(op.estimated_saving_cost)} / run
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{op.description}</p>
                      <div className="mt-2 flex gap-4 text-xs text-gray-500">
                        <span>Best window: {op.action_detail.recommended_start_hour}:00–{op.action_detail.recommended_end_hour}:00</span>
                        <span>Off-peak rate: ${op.action_detail.off_peak_rate.toFixed(2)}/kWh</span>
                        <span>Save {formatKwh(op.estimated_saving_kwh)}</span>
                        <span>Confidence: {(op.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* ── Renewable & Efficiency row ── */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

            {/* Renewable */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sun size={16} className="text-amber-500" />
                  <h2 className="text-sm font-semibold text-gray-700">Renewable Energy</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Renewable Fraction" value={formatPercent(data.renewable.fraction)} color="text-green-600" />
                  <Stat label="Self-Sufficiency" value={formatPercent(data.renewable.self_sufficiency)} color="text-blue-600" />
                  <Stat label="Total Production" value={formatKwh(data.renewable.total_production_kwh)} color="text-amber-600" />
                  <Stat label="Total Consumption" value={formatKwh(data.renewable.total_consumption_kwh)} color="text-gray-700" />
                  <Stat
                    label="Net Energy"
                    value={formatKwh(data.renewable.net_kwh)}
                    color={data.renewable.net_kwh >= 0 ? 'text-green-600' : 'text-red-500'}
                  />
                  <Stat label="Producing Devices" value={String(data.renewable.producing_devices)} color="text-gray-700" />
                </div>
              </CardBody>
            </Card>

            {/* Efficiency */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Gauge size={16} className="text-purple-500" />
                  <h2 className="text-sm font-semibold text-gray-700">Efficiency Scores</h2>
                </div>
                {data.efficiency.overall_score != null && (
                  <span className={`text-lg font-bold ${EFFICIENCY_COLOR[data.efficiency.overall_label]}`}>
                    {Math.round(data.efficiency.overall_score)}/100
                  </span>
                )}
              </CardHeader>
              <CardBody>
                {data.efficiency.devices.length === 0 ? (
                  <p className="text-sm text-gray-400">No readings available yet.</p>
                ) : (
                  <div className="space-y-2">
                    {data.efficiency.devices.map((d: DeviceEfficiency) => (
                      <div key={d.device_id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium text-gray-800">{d.device_name}</span>
                          <span className="ml-1 text-xs text-gray-400">({d.device_type})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {d.efficiency_score != null ? (
                            <>
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="h-full rounded-full bg-green-500"
                                  style={{ width: `${d.efficiency_score}%` }}
                                />
                              </div>
                              <span className={`w-20 text-right font-semibold ${EFFICIENCY_COLOR[d.label]}`}>
                                {Math.round(d.efficiency_score)} · {d.label}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">no data</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* ── Forecast ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-500" />
                <h2 className="text-sm font-semibold text-gray-700">GBM Load Forecast</h2>
              </div>
            </CardHeader>
            <CardBody>
              {data.forecasts.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Forecasting requires trained models. Start a simulation to accumulate readings and train the GBM model automatically.
                </p>
              ) : (
                <div className="space-y-4">
                  {data.forecasts.map((f: DeviceForecast) => (
                    <div key={f.device_id}>
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        {f.device_name}
                        <span className="ml-1 text-xs font-normal text-gray-400">({f.device_type})</span>
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(f.predictions).map(([horizon, pred]) => (
                          <div key={horizon} className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-center">
                            <p className="text-xs text-indigo-500 font-medium">Next {horizon}</p>
                            <p className="mt-1 text-lg font-bold text-indigo-800">{pred.predicted_kwh.toFixed(2)} kWh</p>
                            <p className="text-[10px] text-indigo-400">
                              {pred.lower_bound_kwh.toFixed(1)} – {pred.upper_bound_kwh.toFixed(1)} kWh
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

        </div>
      )}
    </PageShell>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-0.5 text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
}
