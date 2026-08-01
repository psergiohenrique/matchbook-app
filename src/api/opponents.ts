import { request, withQuery } from '@/api/client';
import type {
  CreateOpponentProfileInput,
  OpponentHistoryData,
  OpponentProfile,
  Surface,
  UpdateOpponentProfileInput,
} from '@/types/api';

export const opponentsApi = {
  list: (token: string) => request<OpponentProfile[]>('/api/opponent-profiles', token),

  history: (token: string, opponentId: string, surface?: Surface) =>
    request<OpponentHistoryData>(withQuery(`/api/opponent-profiles/${opponentId}/history`, { surface }), token),

  create: (token: string, body: CreateOpponentProfileInput) =>
    request<OpponentProfile>('/api/opponent-profiles', token, { method: 'POST', body: JSON.stringify(body) }),

  update: (token: string, id: string, body: UpdateOpponentProfileInput) =>
    request<OpponentProfile>(`/api/opponent-profiles/${id}`, token, { method: 'PATCH', body: JSON.stringify(body) }),

  remove: (token: string, id: string) =>
    request<void>(`/api/opponent-profiles/${id}`, token, { method: 'DELETE' }),
};
