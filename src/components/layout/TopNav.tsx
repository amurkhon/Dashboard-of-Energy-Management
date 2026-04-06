import { useEffect, useState } from 'react'
import { LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useWsStore } from '@/store/wsStore'
import { cn } from '@/lib/utils'

export function TopNav() {
  const { user, logout } = useAuthStore()
  const lastPulse = useWsStore((s) => s.lastPulse)
  const isConnected = useWsStore((s) => s.isConnected)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (lastPulse && Date.now() - lastPulse < 5_000) {
      setIsLive(true)
      const timer = setTimeout(() => setIsLive(false), 5_000)
      return () => clearTimeout(timer)
    }
  }, [lastPulse])

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'h-2.5 w-2.5 rounded-full transition-colors',
            isConnected ? 'bg-green-500' : 'bg-gray-300',
            isLive && 'animate-pulse'
          )}
        />
        <span className="text-xs text-gray-500">{isConnected ? 'Live' : 'Offline'}</span>
      </div>

      {/* User */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={16} />
          <span>{user?.full_name ?? user?.email ?? 'User'}</span>
          {user?.role && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 capitalize">
              {user.role}
            </span>
          )}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </header>
  )
}
