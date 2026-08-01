import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { HeroHeader } from '@/components/layout/hero-header';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Pill } from '@/components/ui/pill';
import { Spacing } from '@/constants/theme';
import { playStyleLabels, surfaceOptions } from '@/constants/tennis';
import { useStyleInsights } from '@/queries/use-style-insights';
import { useUiStore } from '@/store/ui-store';
import type { Surface } from '@/types/api';

export default function InsightsScreen() {
  const surfaceFilter = useUiStore((state) => state.selectedSurfaceFilter);
  const setSurfaceFilter = useUiStore((state) => state.setSurfaceFilter);
  const surfaceParam = surfaceFilter === 'ALL' ? undefined : (surfaceFilter as Surface);
  const insights = useStyleInsights(surfaceParam);

  return (
    <ScreenScroll
      refreshControl={<RefreshControl refreshing={insights.isRefetching} onRefresh={() => insights.refetch()} />}>
      <HeroHeader
        eyebrow="Insights por estilo"
        title="Como você joga contra cada perfil"
        subtitle="Filtre por superfície para comparar contexto."
      />

      <View style={styles.filterRow}>
        {surfaceOptions.map((option) => (
          <Pressable key={option.value} onPress={() => setSurfaceFilter(option.value)}>
            <Pill label={option.label} tone={surfaceFilter === option.value ? 'gold' : 'neutral'} />
          </Pressable>
        ))}
      </View>

      {insights.isLoading ? <LoadingState /> : null}

      {insights.data && insights.data.items.length === 0 ? (
        <Card>
          <EmptyState title="Ainda sem partidas com adversário mapeado" description="Cadastre perfis de adversário ao registrar uma partida." />
        </Card>
      ) : null}

      {insights.data?.items.map((item) => (
        <Card key={item.style}>
          <View style={styles.headerRow}>
            <ThemedText type="heading">{playStyleLabels[item.style as keyof typeof playStyleLabels] ?? item.style}</ThemedText>
            <ThemedText type="title" style={styles.winRate}>
              {item.winRate}%
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {item.matchCount} partida{item.matchCount === 1 ? '' : 's'} · {item.wins}V {item.losses}D ·{' '}
            {item.opponentCount} adversário{item.opponentCount === 1 ? '' : 's'}
          </ThemedText>

          {item.topFocusAreas.length > 0 ? (
            <View>
              <ThemedText type="label" themeColor="textSecondary">
                Pontos de treino
              </ThemedText>
              <View style={styles.pillRow}>
                {item.topFocusAreas.map((tag) => (
                  <Pill key={tag.label} label={`${tag.label} · ${tag.count}`} />
                ))}
              </View>
            </View>
          ) : null}

          {item.commonStrengths.length > 0 ? (
            <View>
              <ThemedText type="label" themeColor="textSecondary">
                Pontos fortes comuns
              </ThemedText>
              <View style={styles.pillRow}>
                {item.commonStrengths.map((tag) => (
                  <Pill key={tag.label} label={`${tag.label} · ${tag.count}`} tone="gold" />
                ))}
              </View>
            </View>
          ) : null}
        </Card>
      ))}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  winRate: {
    fontSize: 24,
    lineHeight: 28,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
});
