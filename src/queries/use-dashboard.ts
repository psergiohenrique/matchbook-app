import { useQuery } from '@tanstack/react-query';

import { matchesApi } from '@/api/matches';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';
import type { Surface } from '@/types/api';

export function useDashboard(surface?: Surface) {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.dashboard(surface),
    queryFn: () => matchesApi.dashboard(token!, surface),
    enabled: status === 'signedIn' && !!token,
  });
}
