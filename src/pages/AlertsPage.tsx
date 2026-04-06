import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { useAlertEvents, useAcknowledgeAlert, useAlertRules, useCreateAlertRule, useDeleteAlertRule } from '@/hooks/useAlerts'
import { AlertRuleFormModal } from '@/components/alerts/AlertRuleFormModal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatRelativeTime } from '@/lib/utils'
import type { AlertSeverity } from '@/types/alert'
import type { AlertRuleCreate } from '@/types/alert'

const severityVariant: Record<AlertSeverity, 'critical' | 'warning' | 'info'> = {
  critical: 'critical',
  warning: 'warning',
  info: 'info',
}

export function AlertsPage() {
  const { data: events, isPending: eventsPending } = useAlertEvents()
  const { data: rules, isPending: rulesPending } = useAlertRules()
  const acknowledge = useAcknowledgeAlert()
  const createRule = useCreateAlertRule()
  const deleteRule = useDeleteAlertRule()
  const [ruleModalOpen, setRuleModalOpen] = useState(false)

  const handleCreateRule = async (data: AlertRuleCreate) => {
    await createRule.mutateAsync(data)
  }

  return (
    <PageShell
      title="Alerts"
      actions={
        <Button size="sm" onClick={() => setRuleModalOpen(true)}>
          <Plus size={15} /> New Rule
        </Button>
      }
    >
      {/* Alert Events */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700">Alert Events</h2>
        </CardHeader>
        <CardBody>
          {eventsPending ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : !events?.length ? (
            <p className="text-sm text-gray-400">No alert events.</p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    event.is_acknowledged ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={severityVariant[event.severity]}>{event.severity}</Badge>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {event.rule_name}
                        {event.device_name && (
                          <span className="text-gray-500 font-normal"> · {event.device_name}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.metric} = {event.actual_value.toFixed(2)} (threshold: {event.threshold_value}) · {formatRelativeTime(event.triggered_at)}
                      </p>
                    </div>
                  </div>
                  {!event.is_acknowledged && (
                    <button
                      onClick={() => acknowledge.mutate(event.id)}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
                    >
                      <Check size={12} /> Ack
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Alert Rules */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700">Alert Rules</h2>
        </CardHeader>
        <CardBody>
          {rulesPending ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : !rules?.length ? (
            <p className="text-sm text-gray-400">No alert rules defined. Create one to get started.</p>
          ) : (
            <div className="space-y-2">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{rule.name}</p>
                    <p className="text-xs text-gray-500">
                      {rule.metric} {rule.operator} {rule.threshold} ·{' '}
                      <Badge variant={severityVariant[rule.severity]}>{rule.severity}</Badge>
                      {' '}· cooldown {rule.cooldown_minutes}m
                    </p>
                  </div>
                  <button
                    onClick={() => deleteRule.mutate(rule.id)}
                    className="rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <AlertRuleFormModal
        open={ruleModalOpen}
        onClose={() => setRuleModalOpen(false)}
        onSubmit={handleCreateRule}
      />
    </PageShell>
  )
}
