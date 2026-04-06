import { create } from 'zustand'
import type { LiveReading } from '@/types/websocket'
import type { AlertEventOut } from '@/types/alert'

interface WsState {
  isConnected: boolean
  lastPulse: number | null
  liveReadings: Record<string, LiveReading>
  recentAlerts: AlertEventOut[]
  setConnected: (v: boolean) => void
  updateReading: (r: LiveReading) => void
  addAlert: (a: AlertEventOut) => void
  pulse: () => void
}

export const useWsStore = create<WsState>((set) => ({
  isConnected: false,
  lastPulse: null,
  liveReadings: {},
  recentAlerts: [],

  setConnected: (isConnected) => set({ isConnected }),

  updateReading: (r) =>
    set((s) => ({ liveReadings: { ...s.liveReadings, [r.device_id]: r } })),

  addAlert: (a) =>
    set((s) => ({
      recentAlerts: [a, ...s.recentAlerts].slice(0, 20),
    })),

  pulse: () => set({ lastPulse: Date.now() }),
}))
