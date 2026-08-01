import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { SplashOverlay } from '@/components/splash-overlay';
import { useSession } from '@/auth/session-context';
import { AppProviders } from '@/providers/app-providers';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  return (
    <AppProviders>
      <RootNavigator fontsLoaded={fontsLoaded} />
    </AppProviders>
  );
}

function RootNavigator({ fontsLoaded }: { fontsLoaded: boolean }) {
  const session = useSession();
  const ready = fontsLoaded && session.status !== 'loading';

  return (
    <>
      <Stack>
        <Stack.Protected guard={session.status === 'signedOut'}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={session.status === 'signedIn'}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen
          name="reset-password"
          options={{ presentation: 'modal', title: 'Redefinir senha' }}
        />
      </Stack>
      <SplashOverlay ready={ready} />
    </>
  );
}
