import { request, withQuery } from '@/api/client';
import type {
  AnalyticsData,
  CreateMatchInput,
  DashboardData,
  MatchSummary,
  StyleInsightsData,
  Surface,
  UpdateMatchInput,
} from '@/types/api';

export const matchesApi = {
  dashboard: (token: string, surface?: Surface) =>
    request<DashboardData>(withQuery('/api/matches/dashboard', { surface }), token),

  analytics: (token: string) => request<AnalyticsData>('/api/matches/analytics', token),

  styleInsights: (token: string, surface?: Surface) =>
    request<StyleInsightsData>(withQuery('/api/matches/style-insights', { surface }), token),

  list: (token: string, surface?: Surface) =>
    request<MatchSummary[]>(withQuery('/api/matches', { surface }), token),

  create: (token: string, body: CreateMatchInput) =>
    request<MatchSummary>('/api/matches', token, { method: 'POST', body: JSON.stringify(body) }),

  update: (token: string, id: string, body: UpdateMatchInput) =>
    request<MatchSummary>(`/api/matches/${id}`, token, { method: 'PATCH', body: JSON.stringify(body) }),

  remove: (token: string, id: string) =>
    request<void>(`/api/matches/${id}`, token, { method: 'DELETE' }),
};
