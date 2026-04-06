import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useWsStore } from '@/store/wsStore'
import { formatKw } from '@/lib/utils'

export function LivePowerChart() {
  const liveReadings = useWsStore((s) => s.liveReadings)

  const data = useMemo(() => {
    return Object.values(liveReadings).map((r) => ({
      name: r.device_name,
      power: r.power_kw,
      time: new Date(r.recorded_at).toLocaleTimeString(),
    }))
  }, [liveReadings])

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        No live data — start a simulation or connect devices
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={(v: number) => formatKw(v)} tick={{ fontSize: 11 }} width={60} />
        <Tooltip
          formatter={(v) => [formatKw(Number(v)), 'Power']}
          contentStyle={{ fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="power"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
