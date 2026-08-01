import type { Surface } from '@/types/api';

export const queryKeys = {
  dashboard: (surface?: Surface) => ['dashboard', surface ?? 'ALL'] as const,
  analytics: () => ['analytics'] as const,
  styleInsights: (surface?: Surface) => ['style-insights', surface ?? 'ALL'] as const,
  matches: (surface?: Surface) => ['matches', surface ?? 'ALL'] as const,
  opponentProfiles: () => ['opponent-profiles'] as const,
  opponentHistory: (id: string, surface?: Surface) => ['opponent-history', id, surface ?? 'ALL'] as const,
  tournaments: () => ['tournaments'] as const,
  rankings: () => ['rankings'] as const,
  profile: () => ['profile'] as const,
};
