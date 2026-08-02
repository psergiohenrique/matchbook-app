import { Link } from 'expo-router';
import { LogOut, Plus } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { useSession } from '@/auth/session-context';
import { HeroHeader } from '@/components/layout/hero-header';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { MetricCard, MetricRow } from '@/components/ui/metric-card';
import { Pill } from '@/components/ui/pill';
import { Radius, Spacing } from '@/constants/theme';
import { playStyleLabels, surfaceLabels, surfaceOptions } from '@/constants/tennis';
import { useTheme } from '@/hooks/use-theme';
import { formatDate } from '@/lib/date';
import { useDashboard } from '@/queries/use-dashboard';
import { useOpponentProfiles } from '@/queries/use-opponents';
import { useUiStore } from '@/store/ui-store';
import type { PlayStyle, Surface } from '@/types/api';

export default function DashboardScreen() {
  const theme = useTheme();
  const session = useSession();
  const surfaceFilter = useUiStore((state) => state.selectedSurfaceFilter);
  const styleFilter = useUiStore((state) => state.selectedStyleFilter);
  const setSurfaceFilter = useUiStore((state) => state.setSurfaceFilter);
  const setStyleFilter = useUiStore((state) => state.setStyleFilter);

  const surfaceParam = surfaceFilter === 'ALL' ? undefined : (surfaceFilter as Surface);
  const dashboard = useDashboard(surfaceParam);
  const opponentProfiles = useOpponentProfiles();

  const recentMatches = useMemo(() => {
    const matches = dashboard.data?.recentMatches ?? [];
    if (styleFilter === 'ALL') return matches;
    return matches.filter((match) => match.opponentProfile?.playStyle === styleFilter);
  }, [dashboard.data?.recentMatches, styleFilter]);

  return (
    <ScreenScroll
      refreshControl={
        <RefreshControl refreshing={dashboard.isRefetching} onRefresh={() => dashboard.refetch()} />
      }>
      <HeroHeader
        eyebrow="Matchbook Tennis"
        title="Seu painel de jogo"
        subtitle="Acompanhe resultados, estilos de adversário e evolução de ranking."
        action={
          <Pressable onPress={() => session.signOut()} hitSlop={8} style={styles.logoutButton}>
            <LogOut size={18} color={theme.heroText} />
          </Pressable>
        }
      />

      <SurfaceFilterRow value={surfaceFilter} onChange={setSurfaceFilter} />

      <QuickActionsBar />

      {dashboard.isLoading ? <LoadingState /> : null}

      {dashboard.data ? (
        <>
          <MetricRow>
            <MetricCard label="Partidas" value={String(dashboard.data.summary.totalMatches)} />
            <MetricCard label="Vitórias" value={String(dashboard.data.summary.wins)} />
            <MetricCard label="Derrotas" value={String(dashboard.data.summary.losses)} />
            <MetricCard label="Taxa de vitória" value={`${dashboard.data.summary.winRate}%`} />
          </MetricRow>

          <Card>
            <ThemedText type="heading">Por superfície</ThemedText>
            <View style={styles.breakdownGrid}>
              {Object.entries(dashboard.data.surfaceBreakdown).map(([surface, count]) => (
                <View key={surface} style={[styles.breakdownItem, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="bodyMedium">{surfaceLabels[surface as Surface] ?? surface}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {count} partida{count === 1 ? '' : 's'}
                  </ThemedText>
                </View>
              ))}
            </View>
          </Card>

          <Card>
            <ThemedText type="heading">Por estilo de adversário</ThemedText>
            <View style={styles.breakdownGrid}>
              <Pressable onPress={() => setStyleFilter('ALL')}>
                <Pill label="Todos" tone={styleFilter === 'ALL' ? 'gold' : 'neutral'} />
              </Pressable>
              {Object.entries(dashboard.data.styleBreakdown).map(([style, count]) => (
                <Pressable key={style} onPress={() => setStyleFilter(style as PlayStyle)}>
                  <Pill
                    label={`${playStyleLabels[style as PlayStyle] ?? style} (${count})`}
                    tone={styleFilter === style ? 'gold' : 'neutral'}
                  />
                </Pressable>
              ))}
            </View>
          </Card>

          {dashboard.data.topImprovementAreas.length > 0 ? (
            <Card>
              <ThemedText type="heading">Pontos de treino mais citados</ThemedText>
              <View style={styles.breakdownGrid}>
                {dashboard.data.topImprovementAreas.map((item) => (
                  <Pill key={item.label} label={`${item.label} · ${item.count}`} />
                ))}
              </View>
            </Card>
          ) : null}

          <Card>
            <View style={styles.cardHeaderRow}>
              <ThemedText type="heading">Partidas recentes</ThemedText>
              <Link href="/matches" asChild>
                <Pressable hitSlop={8}>
                  <ThemedText type="link">Ver todas</ThemedText>
                </Pressable>
              </Link>
            </View>
            {recentMatches.length === 0 ? (
              <EmptyState title="Nenhuma partida por aqui" description="Registre sua primeira partida para começar." />
            ) : (
              <View style={styles.list}>
                {recentMatches.map((match) => (
                  <View key={match.id} style={[styles.matchRow, { borderBottomColor: theme.border }]}>
                    <View style={styles.matchRowText}>
                      <ThemedText type="bodyMedium">{match.opponentProfile?.name ?? 'Adversário sem perfil'}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {formatDate(match.playedAt)} · {surfaceLabels[match.surface]} · {match.score}
                      </ThemedText>
                    </View>
                    <Pill label={match.result === 'WIN' ? 'Vitória' : 'Derrota'} tone={match.result === 'WIN' ? 'win' : 'loss'} />
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Card>
            <ThemedText type="heading">Últimos rankings</ThemedText>
            {dashboard.data.latestRankings.length === 0 ? (
              <EmptyState title="Nenhum ranking registrado" />
            ) : (
              <View style={styles.list}>
                {dashboard.data.latestRankings.map((ranking) => (
                  <View key={ranking.id} style={[styles.matchRow, { borderBottomColor: theme.border }]}>
                    <ThemedText type="bodyMedium">{ranking.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {surfaceLabels[ranking.surface]} · {formatDate(ranking.createdAt)}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Card>
            <ThemedText type="heading">Perfis de adversário</ThemedText>
            {(opponentProfiles.data ?? []).length === 0 ? (
              <EmptyState title="Nenhum adversário cadastrado" />
            ) : (
              <View style={styles.list}>
                {opponentProfiles.data?.map((opponent) => (
                  <Link key={opponent.id} href={`/opponents/${opponent.id}`} asChild>
                    <Pressable style={StyleSheet.flatten([styles.matchRow, { borderBottomColor: theme.border }])}>
                      <ThemedText type="bodyMedium">{opponent.name}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {playStyleLabels[opponent.playStyle]}
                      </ThemedText>
                    </Pressable>
                  </Link>
                ))}
              </View>
            )}
          </Card>
        </>
      ) : null}
    </ScreenScroll>
  );
}

function SurfaceFilterRow({ value, onChange }: { value: Surface | 'ALL'; onChange: (value: Surface | 'ALL') => void }) {
  return (
    <View style={styles.filterRow}>
      {surfaceOptions.map((option) => (
        <Pressable key={option.value} onPress={() => onChange(option.value)}>
          <Pill label={option.label} tone={value === option.value ? 'gold' : 'neutral'} />
        </Pressable>
      ))}
    </View>
  );
}

function QuickActionsBar() {
  const theme = useTheme();
  const actions = [
    { href: '/matches/new', label: 'Partida' },
    { href: '/opponents/new', label: 'Adversário' },
    { href: '/tournaments/new', label: 'Torneio' },
    { href: '/rankings/new', label: 'Ranking' },
  ] as const;

  return (
    <View style={styles.quickActions}>
      {actions.map((action) => (
        <Link key={action.href} href={action.href} asChild>
          <Pressable style={StyleSheet.flatten([styles.quickAction, { backgroundColor: theme.accent }])}>
            <Plus size={16} color={theme.accentText} />
            <ThemedText type="smallBold" style={{ color: theme.accentText }}>
              {action.label}
            </ThemedText>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: Spacing.two,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  breakdownItem: {
    flexGrow: 1,
    flexBasis: '45%',
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  matchRowText: {
    flex: 1,
    gap: 2,
  },
});
