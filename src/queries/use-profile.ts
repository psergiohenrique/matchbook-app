import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usersApi } from '@/api/users';
import { useSession } from '@/auth/session-context';
import { queryKeys } from '@/queries/keys';
import type { UpdateProfileInput } from '@/types/api';

export function useProfile() {
  const { token, status } = useSession();

  return useQuery({
    queryKey: queryKeys.profile(),
    queryFn: () => usersApi.getProfile(token!),
    enabled: status === 'signedIn' && !!token,
  });
}

export function useUpdateProfile() {
  const { token } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateProfileInput) => usersApi.updateProfile(token!, body),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile(), data);
    },
  });
}

export function useChangePassword() {
  const { token } = useSession();

  return useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) => usersApi.changePassword(token!, body),
  });
}
