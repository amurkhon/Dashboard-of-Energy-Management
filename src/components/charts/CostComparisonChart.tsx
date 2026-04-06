import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { CostEstimate } from '@/types/analytics'
import { formatCurrency } from '@/lib/utils'

interface Props {
  flat: CostEstimate | undefined
  tou: CostEstimate | undefined
}

export function CostComparisonChart({ flat, tou }: Props) {
  const data = [
    {
      name: 'Cost Comparison',
      'Flat Rate': flat?.total_cost ?? 0,
      'Time of Use': tou?.total_cost ?? 0,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={48}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={(v: number) => `$${v.toFixed(0)}`} tick={{ fontSize: 11 }} width={50} />
        <Tooltip
          formatter={(v) => [formatCurrency(Number(v)), '']}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Flat Rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Time of Use" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
