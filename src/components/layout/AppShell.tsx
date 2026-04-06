import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { useEnergyStream } from '@/hooks/useEnergyStream'
import { useSimStream } from '@/hooks/useSimStream'
import { useDevices } from '@/hooks/useDevices'
import { useLocalSimulation } from '@/hooks/useLocalSimulation'

function AppShellInner() {
  const { data: devices } = useDevices()
  const deviceIds = devices?.map((d) => d.id) ?? []

  // Browser-side simulation loop (no Celery / real devices needed)
  useLocalSimulation()

  // WebSocket connections — will take over from simulation when real devices connect
  useEnergyStream(deviceIds)
  useSimStream()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function AppShell() {
  return <AppShellInner />
}
