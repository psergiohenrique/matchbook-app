import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authApi } from '@/api/auth';
import { signInWithAppleNative, signInWithGoogleNative } from '@/auth/social';
import { tokenStorage } from '@/auth/secure-store';
import type { AuthUser } from '@/types/api';

type SessionStatus = 'loading' | 'signedIn' | 'signedOut';

type Session = {
  status: SessionStatus;
  token: string | null;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const storedToken = await tokenStorage.get();
      if (!storedToken) {
        if (!cancelled) setStatus('signedOut');
        return;
      }

      try {
        const me = await authApi.me(storedToken);
        if (cancelled) return;
        setToken(storedToken);
        setUser(me);
        setStatus('signedIn');
      } catch {
        await tokenStorage.clear();
        if (!cancelled) setStatus('signedOut');
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    await tokenStorage.set(response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
    setStatus('signedIn');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password });
    await tokenStorage.set(response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
    setStatus('signedIn');
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const body = await signInWithGoogleNative();
    const response = await authApi.socialLogin(body);
    await tokenStorage.set(response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
    setStatus('signedIn');
  }, []);

  const signInWithApple = useCallback(async () => {
    const body = await signInWithAppleNative();
    const response = await authApi.socialLogin(body);
    await tokenStorage.set(response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
    setStatus('signedIn');
  }, []);

  const signOut = useCallback(async () => {
    await tokenStorage.clear();
    setToken(null);
    setUser(null);
    setStatus('signedOut');
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<Session>(
    () => ({ status, token, user, signIn, register, signInWithGoogle, signInWithApple, signOut }),
    [status, token, user, signIn, register, signInWithGoogle, signInWithApple, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
