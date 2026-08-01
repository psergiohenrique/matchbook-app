import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
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
import { surfaceLabels, surfaceOptions } from '@/constants/tennis';
import { formatDate } from '@/lib/date';
import { useDeleteMatch, useMatches } from '@/queries/use-matches';
import { useUiStore } from '@/store/ui-store';
import type { Surface } from '@/types/api';

export default function MatchesListScreen() {
  const surfaceFilter = useUiStore((state) => state.selectedSurfaceFilter);
  const setSurfaceFilter = useUiStore((state) => state.setSurfaceFilter);
  const surfaceParam = surfaceFilter === 'ALL' ? undefined : (surfaceFilter as Surface);
  const matches = useMatches(surfaceParam);
  const deleteMatch = useDeleteMatch();

  const handleDelete = (id: string, opponentProfileId?: string | null) => {
    Alert.alert('Excluir partida', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMatch.mutateAsync({ id, opponentProfileId });
            Toast.show({ type: 'success', text1: 'Partida excluída' });
          } catch (err) {
            Toast.show({
              type: 'error',
              text1: err instanceof ApiError ? err.message : 'Não foi possível excluir a partida',
            });
          }
        },
      },
    ]);
  };

  return (
    <ScreenScroll refreshControl={<RefreshControl refreshing={matches.isRefetching} onRefresh={() => matches.refetch()} />}>
      <View style={styles.filterRow}>
        {surfaceOptions.map((option) => (
          <Pressable key={option.value} onPress={() => setSurfaceFilter(option.value)}>
            <Pill label={option.label} tone={surfaceFilter === option.value ? 'gold' : 'neutral'} />
          </Pressable>
        ))}
      </View>

      {matches.isLoading ? <LoadingState /> : null}

      <Card>
        {(matches.data ?? []).length === 0 ? (
          <EmptyState title="Nenhuma partida por aqui" description="Registre sua primeira partida para começar." />
        ) : (
          <View style={styles.list}>
            {matches.data?.map((match) => (
              <Pressable key={match.id} style={styles.row} onPress={() => router.push(`/matches/${match.id}/edit`)}>
                <View style={styles.rowText}>
                  <ThemedText type="bodyMedium">{match.opponentProfile?.name ?? 'Adversário sem perfil'}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {formatDate(match.playedAt)} · {surfaceLabels[match.surface]} · {match.score}
                  </ThemedText>
                </View>
                <Pill label={match.result === 'WIN' ? 'Vitória' : 'Derrota'} tone={match.result === 'WIN' ? 'win' : 'loss'} />
                <Pressable
                  onPress={() => handleDelete(match.id, match.opponentProfile?.id)}
                  hitSlop={8}
                  style={styles.deleteButton}>
                  <Trash2 size={18} color={Colors.light.loss} />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  list: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  deleteButton: {
    marginLeft: Spacing.one,
  },
});
