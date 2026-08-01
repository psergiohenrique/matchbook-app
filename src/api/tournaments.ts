import { request } from '@/api/client';
import type { CreateTournamentInput, Tournament, UpdateTournamentInput } from '@/types/api';

export const tournamentsApi = {
  list: (token: string) => request<Tournament[]>('/api/tournaments', token),

  create: (token: string, body: CreateTournamentInput) =>
    request<Tournament>('/api/tournaments', token, { method: 'POST', body: JSON.stringify(body) }),

  update: (token: string, id: string, body: UpdateTournamentInput) =>
    request<Tournament>(`/api/tournaments/${id}`, token, { method: 'PATCH', body: JSON.stringify(body) }),

  remove: (token: string, id: string) =>
    request<void>(`/api/tournaments/${id}`, token, { method: 'DELETE' }),
};
