import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { rankingsApi } from '@/api/rankings';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';
import type { CreateRankingSnapshotInput, UpdateRankingSnapshotInput } from '@/types/api';

export function useRankings() {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.rankings(),
    queryFn: () => rankingsApi.list(token!),
    enabled: status === 'signedIn' && !!token,
  });
}

export function useCreateRanking() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateRankingSnapshotInput) => rankingsApi.create(token!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useUpdateRanking() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateRankingSnapshotInput }) =>
      rankingsApi.update(token!, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useDeleteRanking() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rankingsApi.remove(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
