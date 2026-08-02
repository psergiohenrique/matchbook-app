import { RefreshControl, StyleSheet, View } from 'react-native';

import { HeroHeader } from '@/components/layout/hero-header';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { MetricCard, MetricRow } from '@/components/ui/metric-card';
import { Pill } from '@/components/ui/pill';
import { Spacing } from '@/constants/theme';
import { playStyleLabels, surfaceLabels } from '@/constants/tennis';
import { useTheme } from '@/hooks/use-theme';
import { formatDate, formatMonthLabel } from '@/lib/date';
import { useAnalytics } from '@/queries/use-analytics';

export default function AnalyticsScreen() {
  const theme = useTheme();
  const analytics = useAnalytics();
  const data = analytics.data;

  return (
    <ScreenScroll
      refreshControl={<RefreshControl refreshing={analytics.isRefetching} onRefresh={() => analytics.refetch()} />}>
      <HeroHeader eyebrow="Fluxo analítico" title="Análise de desempenho" subtitle="Cruze superfície, estilo e tempo." />

      {analytics.isLoading ? <LoadingState /> : null}

      {data ? (
        <>
          <MetricRow>
            <MetricCard label="Partidas" value={String(data.summary.totalMatches)} />
            <MetricCard label="Rankings" value={String(data.summary.totalRankings)} />
            <MetricCard label="Win rate médio" value={`${data.summary.averageWinRate}%`} />
          </MetricRow>

          <Card>
            <ThemedText type="heading">Comparativo por superfície</ThemedText>
            <View style={styles.list}>
              {data.surfaceComparison.map((item) => (
                <View key={item.surface} style={[styles.row, { borderBottomColor: theme.border }]}>
                  <View style={styles.rowText}>
                    <ThemedText type="bodyMedium">{surfaceLabels[item.surface]}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.totalMatches} partidas · {item.wins}V {item.losses}D
                    </ThemedText>
                    {item.topFocusAreas.length > 0 ? (
                      <View style={styles.pillRow}>
                        {item.topFocusAreas.map((tag) => (
                          <Pill key={tag.label} label={tag.label} />
                        ))}
                      </View>
                    ) : null}
                  </View>
                  <ThemedText type="heading">{item.winRate}%</ThemedText>
                </View>
              ))}
            </View>
          </Card>

          <Card>
            <ThemedText type="heading">Tendência mensal</ThemedText>
            {data.monthlyTrend.length === 0 ? (
              <EmptyState title="Sem dados suficientes ainda" />
            ) : (
              <View style={styles.list}>
                {data.monthlyTrend.map((item) => (
                  <View key={item.month} style={[styles.row, { borderBottomColor: theme.border }]}>
                    <ThemedText type="bodyMedium">{formatMonthLabel(item.month)}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.totalMatches} partidas · {item.winRate}%
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Card>
            <ThemedText type="heading">Desempenho por estilo</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Ordenado do estilo que mais pressiona para o que menos pressiona.
            </ThemedText>
            <View style={styles.list}>
              {data.stylePerformance.map((item) => (
                <View key={item.style} style={[styles.row, { borderBottomColor: theme.border }]}>
                  <ThemedText type="bodyMedium">
                    {playStyleLabels[item.style as keyof typeof playStyleLabels] ?? item.style}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.totalMatches} partidas · {item.winRate}%
                  </ThemedText>
                </View>
              ))}
            </View>
          </Card>

          <Card>
            <ThemedText type="heading">Tendência de ranking</ThemedText>
            {data.rankingTrend.length === 0 ? (
              <EmptyState title="Nenhum ranking registrado" />
            ) : (
              <View style={styles.list}>
                {data.rankingTrend.map((ranking) => (
                  <View key={ranking.id} style={[styles.row, { borderBottomColor: theme.border }]}>
                    <ThemedText type="bodyMedium">{ranking.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {surfaceLabels[ranking.surface]} · {formatDate(ranking.createdAt)}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}
          </Card>

          {data.recommendations.length > 0 ? (
            <Card variant="dark">
              <ThemedText type="heading" style={{ color: theme.heroText }}>
                Recomendações
              </ThemedText>
              <View style={styles.list}>
                {data.recommendations.map((rec) => (
                  <View key={rec.title} style={styles.recommendation}>
                    <ThemedText type="bodyMedium" style={{ color: theme.heroText }}>
                      {rec.title}
                    </ThemedText>
                    <ThemedText type="small" style={{ color: theme.heroSub }}>
                      {rec.description}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </Card>
          ) : null}
        </>
      ) : null}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
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
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  recommendation: {
    gap: 2,
  },
});
