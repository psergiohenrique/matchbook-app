import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { matchesApi } from '@/api/matches';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';
import type { CreateMatchInput, MatchSummary, Surface, UpdateMatchInput } from '@/types/api';

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
