import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { DeviceCreate, DeviceType, DeviceProfile } from '@/types/device'

const DEVICE_TYPES: DeviceType[] = [
  'smart_meter', 'solar_panel', 'wind_turbine', 'battery',
  'hvac', 'lighting', 'ev_charger', 'appliance',
]

const PROFILES: DeviceProfile[] = ['residential', 'commercial', 'industrial']

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: DeviceCreate) => Promise<void>
}

export function DeviceFormModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<DeviceCreate>({
    name: '',
    device_type: 'smart_meter',
    profile: 'residential',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
      onClose()
      setForm({ name: '', device_type: 'smart_meter', profile: 'residential' })
    } finally {
      setLoading(false)
    }
  }

  const field = (key: keyof DeviceCreate) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500'

  return (
    <Modal open={open} onClose={onClose} title="Add Device">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input required value={form.name} onChange={field('name')} className={inputCls} placeholder="e.g. Rooftop Solar Panel" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
          <select value={form.device_type} onChange={field('device_type')} className={inputCls}>
            {DEVICE_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Profile</label>
          <select value={form.profile} onChange={field('profile')} className={inputCls}>
            {PROFILES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Add Device</Button>
        </div>
      </form>
    </Modal>
  )
}
