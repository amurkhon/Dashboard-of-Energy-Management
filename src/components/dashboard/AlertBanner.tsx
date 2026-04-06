import { AlertTriangle, X } from 'lucide-react'
import { useAlertEvents, useAcknowledgeAlert } from '@/hooks/useAlerts'

export function AlertBanner() {
  const { data: alerts } = useAlertEvents({ unacknowledged: true })
  const acknowledge = useAcknowledgeAlert()

  const critical = alerts?.filter((a) => a.severity === 'critical' && !a.is_acknowledged) ?? []
  const warnings = alerts?.filter((a) => a.severity === 'warning' && !a.is_acknowledged) ?? []

  if (critical.length === 0 && warnings.length === 0) return null

  return (
    <div className="space-y-2">
      {critical.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <div className="flex items-center gap-2 text-sm text-red-700">
            <AlertTriangle size={16} className="shrink-0" />
            <span>
              <strong>{alert.rule_name}</strong>
              {alert.device_name && ` · ${alert.device_name}`}: {alert.metric} = {alert.actual_value.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => acknowledge.mutate(alert.id)}
            className="ml-4 shrink-0 text-red-500 hover:text-red-700"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      {warnings.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <AlertTriangle size={16} className="shrink-0" />
            <span>
              <strong>{alert.rule_name}</strong>
              {alert.device_name && ` · ${alert.device_name}`}: {alert.metric} = {alert.actual_value.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => acknowledge.mutate(alert.id)}
            className="ml-4 shrink-0 text-amber-500 hover:text-amber-700"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
