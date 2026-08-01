import { useQuery } from '@tanstack/react-query';

import { matchesApi } from '@/api/matches';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';

export function useAnalytics() {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.analytics(),
    queryFn: () => matchesApi.analytics(token!),
    enabled: status === 'signedIn' && !!token,
  });
}
