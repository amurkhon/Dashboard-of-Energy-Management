import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { queryClient } from '@/lib/queryClient'
import { WS_BASE_URL } from '@/config/constants'
import type { WsMessage } from '@/types/websocket'
import { QK } from '@/api/queryKeys'

export function useSimStream() {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) return

    function connect() {
      const ws = new WebSocket(`${WS_BASE_URL}/ws/simulation?token=${accessToken}`)
      wsRef.current = ws

      ws.onmessage = (evt: MessageEvent<string>) => {
        try {
          const msg = JSON.parse(evt.data) as WsMessage
          if (msg.type === 'sim_tick') {
            queryClient.invalidateQueries({ queryKey: QK.simulationStatus })
          }
        } catch {
          // ignore
        }
      }

      ws.onclose = () => {
        reconnectTimer.current = setTimeout(connect, 10_000)
      }
      ws.onerror = () => ws.close()
    }

    connect()

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [accessToken])
}
