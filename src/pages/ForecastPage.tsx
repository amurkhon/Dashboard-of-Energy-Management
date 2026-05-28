import { useState } from 'react'
import { format } from 'date-fns'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ErrorBar, Cell,
} from 'recharts'
import { TrendingUp, Thermometer, Clock, Cpu, Info } from 'lucide-react'
import { useForecastDevices, usePredictForecast } from '@/hooks/useForecast'
import { PageShell } from '@/components/layout/PageShell'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatKwh, formatCurrency } from '@/lib/utils'
import type { HorizonPrediction, ForecastRequest } from '@/types/forecast'

const HORIZON_COLOR: Record<string, string> = {
  '1h': '#6366f1',
  '6h': '#8b5cf6',
  '24h': '#a78bfa',
  '7d': '#c4b5fd',
}

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function localDatetimeValue(d: Date) {
  return format(d, "yyyy-MM-dd'T'HH:mm")
}

function toUtcIso(localStr: string) {
  return new Date(localStr).toISOString()
}

export function ForecastPage() {
  const { data: devices, isPending: devicesPending } = useForecastDevices()
  const predict = usePredictForecast()

  const now = new Date()
  const [deviceId, setDeviceId] = useState<string>('')
  const [targetDt, setTargetDt] = useState(localDatetimeValue(now))
  const [temperature, setTemperature] = useState(20)
  const [currentPower, setCurrentPower] = useState<string>('')
  const [horizons, setHorizons] = useState<Array<'1h' | '6h' | '24h' | '7d'>>(['1h', '6h', '24h', '7d'])

  const toggleHorizon = (h: '1h' | '6h' | '24h' | '7d') => {
    setHorizons((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (horizons.length === 0) return
    const body: ForecastRequest = {
      target_datetime: toUtcIso(targetDt),
      temperature_c: temperature,
      horizons,
      ...(deviceId ? { device_id: deviceId } : {}),
      ...(currentPower !== '' ? { current_power_kw: parseFloat(currentPower) } : {}),
    }
    predict.mutate(body)
  }

  const result = predict.data
  const dt = result ? new Date(result.target_datetime) : null

  // Chart data: one bar per horizon with error bar
  const chartData = result?.predictions.map((p: HorizonPrediction) => ({
    horizon: p.horizon,
    predicted: p.predicted_kwh,
    errorY: [
      p.predicted_kwh - p.lower_kwh,
      p.upper_kwh - p.predicted_kwh,
    ],
    model: p.model,
    costFlat: p.estimated_cost_flat,
    costTou: p.estimated_cost_tou,
  })) ?? []

  return (
    <PageShell
      title="Energy Forecast"
      subtitle="Input parameters and get GBM-based energy consumption predictions"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ── Input Form ── */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-gray-700">Forecast Parameters</h2>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Device */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Cpu size={12} /> Device
                </label>
                {devicesPending ? (
                  <Skeleton className="h-9" />
                ) : (
                  <select
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">All devices (aggregate)</option>
                    {(devices ?? []).map((d) => (
                      <option key={d.device_id} value={d.device_id}>
                        {d.name} ({d.device_type}){d.model_trained ? ' ✓ GBM' : ''}
                      </option>
                    ))}
                  </select>
                )}
                {deviceId && devices && (
                  <p className="mt-1 text-[10px] text-gray-400">
                    {devices.find((d) => d.device_id === deviceId)?.model_trained
                      ? '✓ Trained GBM model available'
                      : '⚠ No trained model — using analytical fallback'}
                  </p>
                )}
              </div>

              {/* Target datetime */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Clock size={12} /> Target date & time
                </label>
                <input
                  type="datetime-local"
                  value={targetDt}
                  onChange={(e) => setTargetDt(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Thermometer size={12} /> Temperature: <span className="font-bold text-indigo-600">{temperature}°C</span>
                </label>
                <input
                  type="range"
                  min={-20}
                  max={50}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>-20°C</span><span>0°C</span><span>20°C</span><span>50°C</span>
                </div>
              </div>

              {/* Current power (optional) */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Current consumption (kW) — optional
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Auto-filled from latest reading"
                  value={currentPower}
                  onChange={(e) => setCurrentPower(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Horizons */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">Forecast horizons</label>
                <div className="flex flex-wrap gap-2">
                  {(['1h', '6h', '24h', '7d'] as const).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => toggleHorizon(h)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                        horizons.includes(h)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                loading={predict.isPending}
                disabled={horizons.length === 0}
              >
                Run Forecast
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* ── Results ── */}
        <div className="space-y-4 xl:col-span-2">

          {predict.isPending && (
            <Card><CardBody><Skeleton className="h-64" /></CardBody></Card>
          )}

          {!predict.isPending && !result && (
            <Card>
              <CardBody className="flex flex-col items-center justify-center py-16 text-center">
                <TrendingUp size={40} className="mb-3 text-indigo-200" />
                <p className="text-sm font-medium text-gray-500">Set parameters and click <strong>Run Forecast</strong></p>
                <p className="mt-1 text-xs text-gray-400">GBM model predicts energy consumption at 1h, 6h, 24h, 7d horizons</p>
              </CardBody>
            </Card>
          )}

          {result && (
            <>
              {/* Header info */}
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="text-xs text-gray-500">Device</p>
                  <p className="text-sm font-semibold text-gray-800">{result.device_name}</p>
                </div>
                {dt && (
                  <div>
                    <p className="text-xs text-gray-500">Target</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {format(dt, 'MMM d, yyyy HH:mm')} ({DOW_LABELS[result.features_used.day_of_week]})
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Temperature</p>
                  <p className="text-sm font-semibold text-gray-800">{result.features_used.temperature_c}°C</p>
                </div>
                <Badge variant={result.model_trained ? 'info' : 'neutral'}>
                  {result.model_trained ? 'GBM Model' : 'Analytical'}
                </Badge>
                {!result.model_trained && (
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Info size={12} /> Train a GBM model by running simulation for 7+ days
                  </span>
                )}
              </div>

              {/* Prediction chart */}
              <Card>
                <CardHeader>
                  <h2 className="text-sm font-semibold text-gray-700">Predicted Consumption (kWh)</h2>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartData} barSize={52}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="horizon" tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={(v: number) => `${v.toFixed(1)}`} tick={{ fontSize: 11 }} width={48} label={{ value: 'kWh', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10 } }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          const d = payload[0].payload
                          return (
                            <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs shadow">
                              <p className="font-semibold text-gray-800">Horizon: {d.horizon}</p>
                              <p className="text-indigo-700">Predicted: {d.predicted.toFixed(2)} kWh</p>
                              <p className="text-gray-500">Range: {(d.predicted - d.errorY[0]).toFixed(2)} – {(d.predicted + d.errorY[1]).toFixed(2)} kWh</p>
                              <p className="text-gray-500">Flat cost: {formatCurrency(d.costFlat)}</p>
                              <p className="text-green-600">TOU cost: {formatCurrency(d.costTou)}</p>
                              <p className="mt-1 text-gray-400">Model: {d.model}</p>
                            </div>
                          )
                        }}
                      />
                      <Bar dataKey="predicted" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry) => (
                          <Cell key={entry.horizon} fill={HORIZON_COLOR[entry.horizon] ?? '#6366f1'} />
                        ))}
                        <ErrorBar dataKey="errorY" width={6} strokeWidth={2} stroke="#374151" direction="y" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>

              {/* Prediction cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {result.predictions.map((p: HorizonPrediction) => (
                  <Card key={p.horizon}>
                    <CardBody className="pt-4">
                      <p className="text-xs font-medium text-gray-500">Next {p.horizon}</p>
                      <p className="mt-1 text-xl font-bold text-indigo-700">{formatKwh(p.predicted_kwh)}</p>
                      <p className="text-[10px] text-gray-400">
                        {p.lower_kwh.toFixed(1)} – {p.upper_kwh.toFixed(1)} kWh
                      </p>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs text-gray-500">Flat: <span className="font-medium text-gray-700">{formatCurrency(p.estimated_cost_flat)}</span></p>
                        <p className="text-xs text-gray-500">TOU: <span className="font-medium text-green-700">{formatCurrency(p.estimated_cost_tou)}</span></p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Feature table */}
              <Card>
                <CardHeader>
                  <h2 className="text-sm font-semibold text-gray-700">Input Features Used by Model</h2>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs sm:grid-cols-4">
                    {Object.entries(result.features_used).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-gray-100 py-1">
                        <span className="text-gray-500">{k.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-gray-800">{typeof v === 'number' ? v.toFixed(2) : String(v)}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </>
          )}
        </div>
      </div>
    </PageShell>
  )
}
