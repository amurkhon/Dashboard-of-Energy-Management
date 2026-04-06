import { useState } from 'react'
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { useDevices, useDeviceGroups, useCreateDevice, useDeleteDevice } from '@/hooks/useDevices'
import { DeviceCard } from '@/components/devices/DeviceCard'
import { DeviceFormModal } from '@/components/devices/DeviceFormModal'
import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import type { DeviceCreate } from '@/types/device'

export function DevicesPage() {
  const { data: devices, isPending } = useDevices()
  const { data: groups } = useDeviceGroups()
  const createDevice = useCreateDevice()
  const deleteDevice = useDeleteDevice()
  const [modalOpen, setModalOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['ungrouped']))

  const toggleGroup = (key: string) =>
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const handleCreate = async (data: DeviceCreate) => {
    await createDevice.mutateAsync(data)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this device?')) deleteDevice.mutate(id)
  }

  // Group devices
  const grouped: Record<string, typeof devices> = {}
  if (groups) {
    for (const g of groups) grouped[g.id] = []
  }
  grouped['ungrouped'] = []

  for (const d of devices ?? []) {
    const key = d.group_id ?? 'ungrouped'
    if (!grouped[key]) grouped[key] = []
    grouped[key]!.push(d)
  }

  const getGroupName = (key: string) => {
    if (key === 'ungrouped') return 'Ungrouped Devices'
    return groups?.find((g) => g.id === key)?.name ?? key
  }

  return (
    <PageShell
      title="Devices"
      subtitle={`${devices?.length ?? 0} devices`}
      actions={
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus size={15} /> Add Device
        </Button>
      }
    >
      {isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([key, devs]) => {
            if (!devs?.length) return null
            const expanded = expandedGroups.has(key)
            return (
              <div key={key} className="rounded-xl border border-gray-200 bg-white">
                <button
                  onClick={() => toggleGroup(key)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>{getGroupName(key)} ({devs.length})</span>
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {expanded && (
                  <div className="border-t border-gray-100 p-3 space-y-2">
                    {devs.map((d) => (
                      <DeviceCard key={d.id} device={d} onDelete={handleDelete} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <DeviceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </PageShell>
  )
}
