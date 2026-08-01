import { request } from '@/api/client';
import type { AuthResponse, AuthUser, SocialLoginInput } from '@/types/api';

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/api/auth/register', null, { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', null, { method: 'POST', body: JSON.stringify(body) }),

  socialLogin: (body: SocialLoginInput) =>
    request<AuthResponse>('/api/auth/social-login', null, { method: 'POST', body: JSON.stringify(body) }),

  forgotPassword: (body: { email: string }) =>
    request<void>('/api/auth/forgot-password', null, { method: 'POST', body: JSON.stringify(body) }),

  resetPassword: (body: { token: string; password: string }) =>
    request<void>('/api/auth/reset-password', null, { method: 'POST', body: JSON.stringify(body) }),

  me: (token: string) => request<AuthUser>('/api/auth/me', token),
};
