import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useWsStore } from '@/store/wsStore'
import { queryClient } from '@/lib/queryClient'
import { WS_BASE_URL } from '@/config/constants'
import type { WsMessage } from '@/types/websocket'
import { QK } from '@/api/queryKeys'

export function useEnergyStream(deviceIds: string[]) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const accessToken = useAuthStore((s) => s.accessToken)
  const { setConnected, updateReading, addAlert, pulse } = useWsStore()
  const deviceKey = deviceIds.join(',')

  useEffect(() => {
    if (!accessToken) return

    function connect() {
      const ws = new WebSocket(`${WS_BASE_URL}/ws/realtime?token=${accessToken}`)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        if (deviceIds.length > 0) {
          ws.send(JSON.stringify({ action: 'subscribe', device_ids: deviceIds }))
        }
        pingInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: 'ping' }))
          }
        }, 25_000)
      }

      ws.onmessage = (evt: MessageEvent<string>) => {
        pulse()
        try {
          const msg = JSON.parse(evt.data) as WsMessage
          if (msg.type === 'reading') {
            updateReading(msg.payload)
            queryClient.invalidateQueries({ queryKey: QK.dashboard })
          } else if (msg.type === 'alert') {
            addAlert(msg.payload)
            queryClient.invalidateQueries({ queryKey: ['alerts'] })
            queryClient.invalidateQueries({ queryKey: QK.dashboard })
          }
        } catch {
          // ignore malformed messages
        }
      }

      ws.onclose = () => {
        setConnected(false)
        if (pingInterval.current) clearInterval(pingInterval.current)
        reconnectTimer.current = setTimeout(connect, 5_000)
      }

      ws.onerror = () => ws.close()
    }

    connect()

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      if (pingInterval.current) clearInterval(pingInterval.current)
      wsRef.current?.close()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, deviceKey])
}
