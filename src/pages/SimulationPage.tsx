import { useState } from 'react'
import { Play, Pause, Square, Plus } from 'lucide-react'
import { useSimulationStatus, useSimulationSessions, useCreateSession, usePauseSession, useResumeSession, useStopSession } from '@/hooks/useSimulation'
import { SimCreateModal } from '@/components/simulation/SimCreateModal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatRelativeTime } from '@/lib/utils'
import type { SimSessionCreate, SimSessionStatus } from '@/types/simulation'

const statusVariant: Record<SimSessionStatus, 'success' | 'warning' | 'neutral' | 'info' | 'critical'> = {
  running: 'success',
  paused: 'warning',
  stopped: 'neutral',
  completed: 'info',
  error: 'critical',
}

export function SimulationPage() {
  const { data: status } = useSimulationStatus()
  const { data: sessions, isPending } = useSimulationSessions()
  const createSession = useCreateSession()
  const pauseSession = usePauseSession()
  const resumeSession = useResumeSession()
  const stopSession = useStopSession()
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreate = async (data: SimSessionCreate) => {
    await createSession.mutateAsync(data)
  }

  return (
    <PageShell
      title="Simulation"
      subtitle="Control simulation sessions"
      actions={
        <Button size="sm" onClick={() => setModalOpen(true)} disabled={status?.running}>
          <Plus size={15} /> New Session
        </Button>
      }
    >
      {/* Current Status */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700">Current Status</h2>
          <Badge variant={status?.running ? 'success' : 'neutral'}>
            {status?.running ? 'Running' : 'Idle'}
          </Badge>
        </CardHeader>
        {status?.session && (
          <CardBody>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">Session ID</p>
                <p className="font-mono text-sm text-gray-800">{status.session.id.slice(0, 8)}…</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Speed</p>
                <p className="text-sm font-bold text-gray-800">{status.session.sim_speed}x</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ticks</p>
                <p className="text-sm font-bold text-gray-800">{status.session.tick_count}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Started</p>
                <p className="text-sm text-gray-800">{formatRelativeTime(status.session.started_at)}</p>
              </div>

              {/* Controls */}
              <div className="ml-auto flex gap-2">
                {status.session.status === 'running' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={pauseSession.isPending}
                    onClick={() => pauseSession.mutate(status.session!.id)}
                  >
                    <Pause size={14} /> Pause
                  </Button>
                )}
                {status.session.status === 'paused' && (
                  <Button
                    size="sm"
                    loading={resumeSession.isPending}
                    onClick={() => resumeSession.mutate(status.session!.id)}
                  >
                    <Play size={14} /> Resume
                  </Button>
                )}
                {(status.session.status === 'running' || status.session.status === 'paused') && (
                  <Button
                    size="sm"
                    variant="danger"
                    loading={stopSession.isPending}
                    onClick={() => stopSession.mutate(status.session!.id)}
                  >
                    <Square size={14} /> Stop
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        )}
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700">Session History</h2>
        </CardHeader>
        <CardBody>
          {isPending ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : !sessions?.length ? (
            <p className="text-sm text-gray-400">No sessions yet. Start a new simulation!</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant[session.status]}>{session.status}</Badge>
                    <div>
                      <p className="font-mono text-xs text-gray-500">{session.id.slice(0, 8)}…</p>
                      <p className="text-xs text-gray-400">
                        {formatRelativeTime(session.started_at)} · {session.tick_count} ticks · {session.sim_speed}x speed
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <SimCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </PageShell>
  )
}
