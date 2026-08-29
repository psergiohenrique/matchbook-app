import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { coachApi } from '@/api/coach';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';

const POLLING_STATUSES = new Set(['NOT_STARTED', 'GENERATING']);

export function useCoachSummary(matchId: string) {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.coachSummary(matchId),
    queryFn: () => coachApi.getSummary(token!, matchId),
    enabled: status === 'signedIn' && !!token && !!matchId,
    // "Coach is thinking…" placeholder while GENERATING (or NOT_STARTED,
    // which covers the brief race right after save before the backend's
    // fire-and-forget trigger lands its first write). Stops polling once
    // the card is READY or FAILED.
    refetchInterval: (query) => (POLLING_STATUSES.has(query.state.data?.status ?? '') ? 2000 : false),
  });
}

export function useTriggerCoachGeneration(matchId: string) {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => coachApi.triggerGeneration(token!, matchId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.coachSummary(matchId), data);
    },
  });
}
