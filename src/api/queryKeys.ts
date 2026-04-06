import type { Granularity, TariffType } from '@/types/analytics'
import type { SuggestionCategory, SuggestionPriority } from '@/types/suggestion'
import type { AlertSeverity } from '@/types/alert'

export const QK = {
  dashboard: ['dashboard'] as const,

  consumption: (params: { from_dt?: string; to_dt?: string; granularity?: Granularity; device_id?: string }) =>
    ['analytics', 'consumption', params] as const,

  production: (params: { from_dt?: string; to_dt?: string; granularity?: Granularity }) =>
    ['analytics', 'production', params] as const,

  efficiency: (params: { from_dt?: string; to_dt?: string }) =>
    ['analytics', 'efficiency', params] as const,

  cost: (params: { from_dt?: string; to_dt?: string; tariff_type?: TariffType }) =>
    ['analytics', 'cost', params] as const,

  heatmap: (params: { from_dt?: string; to_dt?: string }) =>
    ['analytics', 'heatmap', params] as const,

  devices: ['devices'] as const,
  deviceGroups: ['device-groups'] as const,

  latestReadings: ['readings', 'latest'] as const,

  alerts: (filters?: { severity?: AlertSeverity; acknowledged?: boolean }) =>
    ['alerts', filters] as const,

  alertRules: ['alert-rules'] as const,

  suggestions: (filters?: { category?: SuggestionCategory; priority?: SuggestionPriority }) =>
    ['suggestions', filters] as const,

  suggestionSummary: ['suggestions', 'summary'] as const,

  simulationSessions: ['simulation', 'sessions'] as const,
  simulationStatus: ['simulation', 'status'] as const,

  efficiencyScore: (hours: number) => ['efficiency', 'score', hours] as const,
  deviceEfficiencyScore: (deviceId: string, hours: number) =>
    ['efficiency', 'score', deviceId, hours] as const,
  efficiencyHistory: (days: number, deviceId?: string) =>
    ['efficiency', 'history', days, deviceId] as const,
}
