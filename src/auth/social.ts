import * as AppleAuthentication from 'expo-apple-authentication';

import { isExpoGo } from '@/lib/runtime';
import type { SocialLoginInput } from '@/types/api';

let googleConfigured = false;

/**
 * Lazy require: `@react-native-google-signin` registers its native module (via
 * TurboModuleRegistry.getEnforcing) as soon as it's imported, which throws immediately
 * in Expo Go (no such native module there). Only touch it when actually signing in with
 * Google, on a real dev-client/standalone build.
 */
function loadGoogleSignin() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@react-native-google-signin/google-signin') as typeof import('@react-native-google-signin/google-signin');
}

export async function signInWithGoogleNative(): Promise<SocialLoginInput> {
  if (isExpoGo) {
    throw new Error('Login com Google exige um build de desenvolvimento (não funciona no Expo Go)');
  }

  const { GoogleSignin, isSuccessResponse } = loadGoogleSignin();

  if (!googleConfigured) {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
    });
    googleConfigured = true;
  }

  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  if (!isSuccessResponse(response) || !response.data.idToken) {
    throw new Error('Login com Google cancelado ou incompleto');
  }

  return {
    idToken: response.data.idToken,
    provider: 'GOOGLE',
    fullName: response.data.user.name ?? undefined,
  };
}

export async function signInWithAppleNative(): Promise<SocialLoginInput> {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error('Login com Apple incompleto');
  }

  const fullName = credential.fullName
    ? [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(' ')
    : undefined;

  return {
    idToken: credential.identityToken,
    provider: 'APPLE',
    fullName: fullName || undefined,
  };
}
