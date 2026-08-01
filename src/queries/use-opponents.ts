import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { opponentsApi } from '@/api/opponents';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';
import type { CreateOpponentProfileInput, Surface, UpdateOpponentProfileInput } from '@/types/api';

export function useOpponentProfiles() {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.opponentProfiles(),
    queryFn: () => opponentsApi.list(token!),
    enabled: status === 'signedIn' && !!token,
  });
}

export function useOpponentHistory(opponentId: string, surface?: Surface) {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.opponentHistory(opponentId, surface),
    queryFn: () => opponentsApi.history(token!, opponentId, surface),
    enabled: status === 'signedIn' && !!token && !!opponentId,
  });
}

export function useCreateOpponentProfile() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateOpponentProfileInput) => opponentsApi.create(token!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opponent-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateOpponentProfile() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateOpponentProfileInput }) =>
      opponentsApi.update(token!, id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['opponent-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['opponent-history', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

export function useDeleteOpponentProfile() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => opponentsApi.remove(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opponent-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['style-insights'] });
    },
  });
}
