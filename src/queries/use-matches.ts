import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { matchesApi } from '@/api/matches';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';
import type { CoachSummary, CreateMatchInput, MatchSummary, Surface, UpdateMatchInput } from '@/types/api';

export function useMatches(surface?: Surface) {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.matches(surface),
    queryFn: () => matchesApi.list(token!, surface),
    enabled: status === 'signedIn' && !!token,
  });
}

export function useCreateMatch() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateMatchInput) => matchesApi.create(token!, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['style-insights'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      if (variables.opponentProfileId) {
        queryClient.invalidateQueries({ queryKey: ['opponent-history', variables.opponentProfileId] });
      }
    },
  });
}

function invalidateMatchRelatedQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  opponentProfileId?: string | null,
) {
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  queryClient.invalidateQueries({ queryKey: ['analytics'] });
  queryClient.invalidateQueries({ queryKey: ['style-insights'] });
  queryClient.invalidateQueries({ queryKey: ['matches'] });
  if (opponentProfileId) {
    queryClient.invalidateQueries({ queryKey: ['opponent-history', opponentProfileId] });
  }
}

export function useUpdateMatch() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateMatchInput }) => matchesApi.update(token!, id, body),
    onSuccess: (data: MatchSummary, variables) => {
      invalidateMatchRelatedQueries(queryClient, variables.body.opponentProfileId ?? data.opponentProfile?.id);

      // The backend invalidates+regenerates an existing coach summary on
      // edit, but that write happens in the background (fire-and-forget,
      // same as on create) — invalidating and refetching right now could
      // race it and still see the stale READY/FAILED state. Flip the card
      // to GENERATING optimistically instead, only when a summary already
      // exists (a match that was never coached shouldn't spontaneously
      // grow one) — this alone reschedules the polling interval (see
      // useCoachSummary), which then picks up the real state once the
      // backend's background write has actually landed.
      const coachSummaryKey = queryKeys.coachSummary(variables.id);
      const currentSummary = queryClient.getQueryData<CoachSummary>(coachSummaryKey);
      if (currentSummary?.status === 'READY' || currentSummary?.status === 'FAILED') {
        queryClient.setQueryData<CoachSummary>(coachSummaryKey, {
          status: 'GENERATING',
          language: currentSummary.language,
        });
      }
    },
  });
}

export function useDeleteMatch() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; opponentProfileId?: string | null }) => matchesApi.remove(token!, id),
    onSuccess: (_data, variables) => {
      invalidateMatchRelatedQueries(queryClient, variables.opponentProfileId);
    },
  });
}
