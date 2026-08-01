import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.light.background },
        headerTintColor: Colors.light.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="opponents/[opponentId]" options={{ title: 'Adversário' }} />
      <Stack.Screen name="opponents/[opponentId]/edit" options={{ presentation: 'formSheet', title: 'Editar adversário' }} />
      <Stack.Screen name="opponents/new" options={{ presentation: 'formSheet', title: 'Novo adversário' }} />
      <Stack.Screen name="tournaments/new" options={{ presentation: 'formSheet', title: 'Novo torneio' }} />
      <Stack.Screen name="tournaments/[id]/edit" options={{ presentation: 'formSheet', title: 'Editar torneio' }} />
      <Stack.Screen name="rankings/new" options={{ presentation: 'formSheet', title: 'Novo ranking' }} />
      <Stack.Screen name="rankings/[id]/edit" options={{ presentation: 'formSheet', title: 'Editar ranking' }} />
      <Stack.Screen name="matches/new" options={{ presentation: 'formSheet', title: 'Nova partida' }} />
      <Stack.Screen name="matches/index" options={{ title: 'Partidas' }} />
      <Stack.Screen name="matches/[matchId]/edit" options={{ presentation: 'formSheet', title: 'Editar partida' }} />
    </Stack>
  );
}
