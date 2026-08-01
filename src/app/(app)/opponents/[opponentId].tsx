import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pencil, Trash2 } from 'lucide-react-native';
import { Alert, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ApiError } from '@/api/client';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Pill } from '@/components/ui/pill';
import { Colors, Spacing } from '@/constants/theme';
import { handednessLabels, playStyleLabels, surfaceLabels, surfaceOptions } from '@/constants/tennis';
import { formatDate } from '@/lib/date';
import { useDeleteOpponentProfile, useOpponentHistory } from '@/queries/use-opponents';
import { useUiStore } from '@/store/ui-store';
import type { Surface } from '@/types/api';

export default function OpponentHistoryScreen() {
  const { opponentId } = useLocalSearchParams<{ opponentId: string }>();
  const surfaceFilter = useUiStore((state) => state.selectedSurfaceFilter);
  const setSurfaceFilter = useUiStore((state) => state.setSurfaceFilter);
  const surfaceParam = surfaceFilter === 'ALL' ? undefined : (surfaceFilter as Surface);
  const history = useOpponentHistory(opponentId, surfaceParam);
  const deleteOpponentProfile = useDeleteOpponentProfile();

  const data = history.data;

  const handleDelete = () => {
    Alert.alert('Excluir adversário', 'Isso remove o perfil do adversário. As partidas registradas permanecem.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteOpponentProfile.mutateAsync(opponentId);
            Toast.show({ type: 'success', text1: 'Adversário excluído' });
            router.back();
          } catch (err) {
            Toast.show({
              type: 'error',
              text1: err instanceof ApiError ? err.message : 'Não foi possível excluir o adversário',
            });
          }
        },
      },
    ]);
  };

  return (
    <ScreenScroll
      refreshControl={<RefreshControl refreshing={history.isRefetching} onRefresh={() => history.refetch()} />}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable onPress={() => router.push(`/opponents/${opponentId}/edit`)} hitSlop={8}>
                <Pencil size={20} color={Colors.light.text} />
              </Pressable>
              <Pressable onPress={handleDelete} hitSlop={8}>
                <Trash2 size={20} color={Colors.light.loss} />
              </Pressable>
            </View>
          ),
        }}
      />
      {history.isLoading ? <LoadingState /> : null}

      {data ? (
        <>
          <Card variant="dark">
            <ThemedText type="title" style={styles.opponentName}>
              {data.opponent.name}
            </ThemedText>
            <View style={styles.pillRow}>
              <Pill label={playStyleLabels[data.opponent.playStyle]} tone="gold" />
              <Pill label={handednessLabels[data.opponent.handedness]} />
            </View>
            {data.opponent.strengths.length > 0 ? (
              <View>
                <ThemedText type="label" style={styles.darkLabel}>
                  Pontos fortes
                </ThemedText>
                <View style={styles.pillRow}>
                  {data.opponent.strengths.map((tag) => (
                    <Pill key={tag} label={tag} />
                  ))}
                </View>
              </View>
            ) : null}
            {data.opponent.weaknesses.length > 0 ? (
              <View>
                <ThemedText type="label" style={styles.darkLabel}>
                  Pontos fracos
                </ThemedText>
                <View style={styles.pillRow}>
                  {data.opponent.weaknesses.map((tag) => (
                    <Pill key={tag} label={tag} />
                  ))}
                </View>
              </View>
            ) : null}
            {data.opponent.notes ? (
              <ThemedText type="small" style={styles.darkLabel}>
                {data.opponent.notes}
              </ThemedText>
            ) : null}
          </Card>

          <View style={styles.filterRow}>
            {surfaceOptions.map((option) => (
              <Pressable key={option.value} onPress={() => setSurfaceFilter(option.value)}>
                <Pill label={option.label} tone={surfaceFilter === option.value ? 'gold' : 'neutral'} />
              </Pressable>
            ))}
          </View>

          <Card>
            <ThemedText type="heading">Resumo</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {data.summary.totalMatches} partidas · {data.summary.wins}V {data.summary.losses}D ·{' '}
              {data.summary.winRate}% de aproveitamento
            </ThemedText>
          </Card>

          {data.recurringFocusAreas.length > 0 ? (
            <Card>
              <ThemedText type="heading">Pontos recorrentes de treino</ThemedText>
              <View style={styles.pillRow}>
                {data.recurringFocusAreas.map((tag) => (
                  <Pill key={tag.label} label={`${tag.label} · ${tag.count}`} />
                ))}
              </View>
            </Card>
          ) : null}

          <Card>
            <ThemedText type="heading">Histórico de partidas</ThemedText>
            {data.matches.length === 0 ? (
              <EmptyState title="Nenhuma partida contra esse adversário ainda" />
            ) : (
              <View style={styles.list}>
                {data.matches.map((match) => (
                  <View key={match.id} style={styles.matchRow}>
                    <View style={styles.matchRowText}>
                      <ThemedText type="bodyMedium">
                        {surfaceLabels[match.surface]} · {match.score}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {formatDate(match.playedAt)}
                        {match.tournament ? ` · ${match.tournament.name}` : ''}
                      </ThemedText>
                    </View>
                    <Pill label={match.result === 'WIN' ? 'Vitória' : 'Derrota'} tone={match.result === 'WIN' ? 'win' : 'loss'} />
                  </View>
                ))}
              </View>
            )}
          </Card>
        </>
      ) : null}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginRight: Spacing.one,
  },
  opponentName: {
    color: '#fff8eb',
    fontSize: 26,
    lineHeight: 32,
  },
  darkLabel: {
    color: 'rgba(255, 248, 235, 0.75)',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  list: {
    gap: Spacing.two,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  matchRowText: {
    flex: 1,
    gap: 2,
  },
});
