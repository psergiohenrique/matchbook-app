import { request } from '@/api/client';
import type { CreateRankingSnapshotInput, RankingSnapshot, UpdateRankingSnapshotInput } from '@/types/api';

export const rankingsApi = {
  list: (token: string) => request<RankingSnapshot[]>('/api/rankings', token),

  create: (token: string, body: CreateRankingSnapshotInput) =>
    request<RankingSnapshot>('/api/rankings', token, { method: 'POST', body: JSON.stringify(body) }),

  update: (token: string, id: string, body: UpdateRankingSnapshotInput) =>
    request<RankingSnapshot>(`/api/rankings/${id}`, token, { method: 'PATCH', body: JSON.stringify(body) }),

  remove: (token: string, id: string) =>
    request<void>(`/api/rankings/${id}`, token, { method: 'DELETE' }),
};
