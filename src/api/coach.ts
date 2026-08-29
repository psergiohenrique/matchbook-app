import { request } from '@/api/client';
import type { CoachMessage, CoachSummary } from '@/types/api';

export const coachApi = {
  getSummary: (token: string, matchId: string) => request<CoachSummary>(`/api/matches/${matchId}/coach`, token),

  triggerGeneration: (token: string, matchId: string) =>
    request<CoachSummary>(`/api/matches/${matchId}/coach`, token, { method: 'POST' }),

  listMessages: (token: string, matchId: string) =>
    request<CoachMessage[]>(`/api/matches/${matchId}/coach/messages`, token),

  sendMessage: (token: string, matchId: string, content: string) =>
    request<CoachMessage>(`/api/matches/${matchId}/coach/messages`, token, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};
