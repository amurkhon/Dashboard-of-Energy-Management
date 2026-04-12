import { useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { useSimStore } from '@/store/simStore'
import { formatKw } from '@/lib/utils'

const DEVICE_LINES = [
  { key: 'solar',    label: 'Solar',    color: '#f59e0b' },
  { key: 'battery',  label: 'Battery',  color: '#8b5cf6' },
  { key: 'hvac',     label: 'HVAC',     color: '#3b82f6' },
  { key: 'lighting', label: 'Lighting', color: '#6b7280' },
  { key: 'ev',       label: 'EV',       color: '#06b6d4' },
  { key: 'washer',   label: 'Washer',   color: '#ec4899' },
]

export function LivePowerChart() {
  const history = useSimStore((s) => s.history)

  const data = useMemo(() =>
    history.map((snap) => {
      const byType: Record<string, number> = {}
      for (const r of snap.readings) {
        if (r.deviceId === 'sim-solar')    byType['solar']    = r.powerKw
        if (r.deviceId === 'sim-battery')  byType['battery']  = r.powerKw
        if (r.deviceId === 'sim-hvac')     byType['hvac']     = r.powerKw
        if (r.deviceId === 'sim-lighting') byType['lighting'] = r.powerKw
        if (r.deviceId === 'sim-ev')       byType['ev']       = r.powerKw
        if (r.deviceId === 'sim-washer')   byType['washer']   = r.powerKw
      }
      return {
        time: new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ...byType,
      }
    }),
    [history],
  )

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-gray-400">
        Initialising simulation...
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v: number) => formatKw(v)}
          tick={{ fontSize: 10 }}
          width={58}
        />
        <Tooltip
          formatter={(v, name) => [formatKw(v as number), String(name ?? '')]}
          contentStyle={{ fontSize: 11 }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        {DEVICE_LINES.map(({ key, label, color }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
