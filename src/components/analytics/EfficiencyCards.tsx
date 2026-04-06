import type { EfficiencyStats } from '@/types/analytics'
import { formatPercent, formatKwh } from '@/lib/utils'
import { Card, CardBody } from '@/components/ui/Card'

export function EfficiencyCards({ stats }: { stats: EfficiencyStats }) {
  const items = [
    { label: 'Renewable Fraction', value: formatPercent(stats.renewable_fraction), color: 'text-green-600' },
    { label: 'Self-Sufficiency', value: formatPercent(stats.self_sufficiency_ratio), color: 'text-blue-600' },
    { label: 'Net Energy', value: formatKwh(stats.net_energy_kwh), color: stats.net_energy_kwh >= 0 ? 'text-green-600' : 'text-red-500' },
    { label: 'Total Consumption', value: formatKwh(stats.total_consumption_kwh), color: 'text-gray-700' },
    { label: 'Total Production', value: formatKwh(stats.total_production_kwh), color: 'text-amber-600' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map(({ label, value, color }) => (
        <Card key={label}>
          <CardBody className="pt-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
