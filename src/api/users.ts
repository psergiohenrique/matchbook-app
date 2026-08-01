import { request } from '@/api/client';
import type { UpdateProfileInput, UserProfile } from '@/types/api';

export const usersApi = {
  getProfile: (token: string) => request<UserProfile>('/api/users/profile', token),

  updateProfile: (token: string, body: UpdateProfileInput) =>
    request<UserProfile>('/api/users/profile', token, { method: 'PATCH', body: JSON.stringify(body) }),

  changePassword: (token: string, body: { currentPassword: string; newPassword: string }) =>
    request<void>('/api/users/change-password', token, { method: 'POST', body: JSON.stringify(body) }),
};
