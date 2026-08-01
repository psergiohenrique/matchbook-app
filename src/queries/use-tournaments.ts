import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tournamentsApi } from '@/api/tournaments';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';
import type { CreateTournamentInput, UpdateTournamentInput } from '@/types/api';

export function useTournaments() {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.tournaments(),
    queryFn: () => tournamentsApi.list(token!),
    enabled: status === 'signedIn' && !!token,
  });
}

export function useCreateTournament() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateTournamentInput) => tournamentsApi.create(token!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
}

export function useUpdateTournament() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTournamentInput }) =>
      tournamentsApi.update(token!, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

export function useDeleteTournament() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tournamentsApi.remove(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}
