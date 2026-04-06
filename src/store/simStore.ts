import { create } from 'zustand'
import type { SimSnapshot } from '@/simulation/deviceSimulator'

const HISTORY_SIZE = 40   // keep last 40 ticks (~2 min at 3s interval)

interface SimState {
  isRunning: boolean
  current: SimSnapshot | null
  history: SimSnapshot[]       // oldest → newest
  _addSnapshot: (snap: SimSnapshot) => void
  setRunning: (v: boolean) => void
}

export const useSimStore = create<SimState>((set) => ({
  isRunning: false,
  current: null,
  history: [],

  _addSnapshot: (snap) =>
    set((s) => ({
      current: snap,
      history: [...s.history, snap].slice(-HISTORY_SIZE),
    })),

  setRunning: (isRunning) => set({ isRunning }),
}))
