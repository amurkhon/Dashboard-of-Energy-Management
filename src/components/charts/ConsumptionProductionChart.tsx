import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { format } from 'date-fns'
import type { ConsumptionBucket, ProductionBucket } from '@/types/analytics'

interface Props {
  consumption: ConsumptionBucket[]
  production: ProductionBucket[]
}

export function ConsumptionProductionChart({ consumption, production }: Props) {
  // Merge by timestamp
  const productionByTs = Object.fromEntries(
    production.map((p) => [p.timestamp, p.total_kwh])
  )
  const data = consumption.map((c) => ({
    ts: c.timestamp,
    label: format(new Date(c.timestamp), 'MMM d HH:mm'),
    consumption: c.total_kwh,
    production: productionByTs[c.timestamp] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="consumption-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="production-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tickFormatter={(v: number) => `${v.toFixed(1)}`} tick={{ fontSize: 11 }} width={50} />
        <Tooltip
          formatter={(v, name) => [`${Number(v).toFixed(2)} kWh`, name as string]}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="consumption" name="Consumption" stroke="#3b82f6" fill="url(#consumption-grad)" strokeWidth={2} />
        <Area type="monotone" dataKey="production" name="Production" stroke="#22c55e" fill="url(#production-grad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
