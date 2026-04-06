import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { AlertRuleCreate, AlertMetric, AlertOperator, AlertSeverity } from '@/types/alert'

const METRICS: AlertMetric[] = ['power_kw', 'energy_kwh', 'state_of_charge', 'temperature_c']
const OPERATORS: AlertOperator[] = ['>', '<', '>=', '<=', '==']
const SEVERITIES: AlertSeverity[] = ['info', 'warning', 'critical']

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: AlertRuleCreate) => Promise<void>
}

export function AlertRuleFormModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<AlertRuleCreate>({
    name: '',
    metric: 'power_kw',
    operator: '>',
    threshold: 0,
    severity: 'warning',
    cooldown_minutes: 30,
  })
  const [loading, setLoading] = useState(false)

  const field = (key: keyof AlertRuleCreate) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: key === 'threshold' || key === 'cooldown_minutes' ? Number(e.target.value) : e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500'

  return (
    <Modal open={open} onClose={onClose} title="Create Alert Rule">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Rule Name</label>
          <input required value={form.name} onChange={field('name')} className={inputCls} placeholder="e.g. High Power Alert" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Metric</label>
            <select value={form.metric} onChange={field('metric')} className={inputCls}>
              {METRICS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Operator</label>
            <select value={form.operator} onChange={field('operator')} className={inputCls}>
              {OPERATORS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Threshold</label>
            <input type="number" step="any" required value={form.threshold} onChange={field('threshold')} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Severity</label>
            <select value={form.severity} onChange={field('severity')} className={inputCls}>
              {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cooldown (minutes)</label>
          <input type="number" value={form.cooldown_minutes ?? 30} onChange={field('cooldown_minutes')} className={inputCls} min={1} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Create Rule</Button>
        </div>
      </form>
    </Modal>
  )
}
