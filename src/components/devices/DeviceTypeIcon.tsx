import { Zap, Sun, Wind, Battery, Thermometer, Lightbulb, Car, Plug } from 'lucide-react'
import type { DeviceType } from '@/types/device'

const iconMap: Record<DeviceType, React.ElementType> = {
  smart_meter: Zap,
  solar_panel: Sun,
  wind_turbine: Wind,
  battery: Battery,
  hvac: Thermometer,
  lighting: Lightbulb,
  ev_charger: Car,
  appliance: Plug,
}

const colorMap: Record<DeviceType, string> = {
  smart_meter: 'text-green-600 bg-green-50',
  solar_panel: 'text-amber-500 bg-amber-50',
  wind_turbine: 'text-sky-500 bg-sky-50',
  battery: 'text-violet-600 bg-violet-50',
  hvac: 'text-orange-500 bg-orange-50',
  lighting: 'text-yellow-500 bg-yellow-50',
  ev_charger: 'text-blue-600 bg-blue-50',
  appliance: 'text-gray-500 bg-gray-50',
}

export function DeviceTypeIcon({ type, size = 18 }: { type: DeviceType; size?: number }) {
  const Icon = iconMap[type]
  const colors = colorMap[type]
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors}`}>
      <Icon size={size} />
    </div>
  )
}
