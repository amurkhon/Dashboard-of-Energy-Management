import { Trash2 } from 'lucide-react'
import { DeviceTypeIcon } from './DeviceTypeIcon'
import { Badge } from '@/components/ui/Badge'
import type { DeviceOut } from '@/types/device'

interface Props {
  device: DeviceOut
  onDelete: (id: string) => void
}

export function DeviceCard({ device, onDelete }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
      <DeviceTypeIcon type={device.device_type} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">{device.name}</p>
        <p className="text-xs text-gray-500 capitalize">{device.device_type.replace('_', ' ')} · {device.profile}</p>
      </div>
      <Badge variant={device.is_active ? 'success' : 'neutral'}>
        {device.is_active ? 'Active' : 'Inactive'}
      </Badge>
      <button
        onClick={() => onDelete(device.id)}
        className="ml-1 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
