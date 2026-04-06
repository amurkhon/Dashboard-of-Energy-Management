import type { LucideIcon } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  subtitle?: string
}

export function KpiCard({ label, value, icon: Icon, iconColor = 'text-green-600', iconBg = 'bg-green-50', subtitle }: KpiCardProps) {
  return (
    <Card>
      <CardBody className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
          </div>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
