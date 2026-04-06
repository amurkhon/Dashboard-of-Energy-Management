import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKw(value: number): string {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)} MW`
  return `${value.toFixed(2)} kW`
}

export function formatKwh(value: number): string {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)} MWh`
  return `${value.toFixed(2)} kWh`
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return `${Math.floor(diffHr / 24)}d ago`
}

export function interpolateColor(t: number, cold = '#dbeafe', hot = '#1d4ed8'): string {
  const hexToRgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  })
  const c = hexToRgb(cold)
  const h = hexToRgb(hot)
  const r = Math.round(c.r + (h.r - c.r) * t)
  const g = Math.round(c.g + (h.g - c.g) * t)
  const b = Math.round(c.b + (h.b - c.b) * t)
  return `rgb(${r},${g},${b})`
}
