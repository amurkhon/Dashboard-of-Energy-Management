import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useDevices } from '@/hooks/useDevices'
import type { SimSessionCreate } from '@/types/simulation'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: SimSessionCreate) => Promise<void>
}

export function SimCreateModal({ open, onClose, onSubmit }: Props) {
  const { data: devices } = useDevices()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [speed, setSpeed] = useState(1.0)
  const [loading, setLoading] = useState(false)

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ device_ids: selectedIds, sim_speed: speed })
      onClose()
      setSelectedIds([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Start Simulation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select Devices ({selectedIds.length} selected)
          </label>
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2">
            {devices?.map((d) => (
              <label key={d.id} className="flex cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(d.id)}
                  onChange={() => toggle(d.id)}
                  className="accent-green-600"
                />
                <span className="text-sm text-gray-700">{d.name}</span>
                <span className="text-xs text-gray-400">({d.device_type})</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Simulation Speed: {speed}x
          </label>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0.5x</span><span>5x</span><span>10x</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={selectedIds.length === 0}>
            Start Simulation
          </Button>
        </div>
      </form>
    </Modal>
  )
}
