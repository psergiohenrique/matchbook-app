import {
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { SplashOverlay } from '@/components/splash-overlay';
import { useSession } from '@/auth/session-context';
import { AppProviders } from '@/providers/app-providers';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
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
        <Stack.Protected guard={session.status !== 'loading'}>
          <Stack.Screen
            name="reset-password"
            options={{ presentation: 'modal', title: 'Redefinir senha' }}
          />
        </Stack.Protected>
      </Stack>
      <SplashOverlay ready={ready} />
    </>
  );
}
