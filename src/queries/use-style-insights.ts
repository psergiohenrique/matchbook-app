import { useQuery } from '@tanstack/react-query';

import { matchesApi } from '@/api/matches';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';
import type { Surface } from '@/types/api';

export function useStyleInsights(surface?: Surface) {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.styleInsights(surface),
    queryFn: () => matchesApi.styleInsights(token!, surface),
    enabled: status === 'signedIn' && !!token,
  });
}
