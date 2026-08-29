import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TennisBallLoader } from '@/components/ui/tennis-ball-loader';
import { Spacing } from '@/constants/theme';
import { useCoachSummary, useTriggerCoachGeneration } from '@/queries/use-coach';

type CoachCardProps = {
  matchId: string;
};

/**
 * The AI coach's post-match summary: strengths / one weakness / one action
 * item. Polls while GENERATING (or NOT_STARTED — the brief race right after
 * save before the backend's background trigger lands its first write), and
 * offers a manual retry on FAILED.
 */
export function CoachCard({ matchId }: CoachCardProps) {
  const summary = useCoachSummary(matchId);
  const trigger = useTriggerCoachGeneration(matchId);

  const status = summary.data?.status;

  if (summary.isLoading || status === 'NOT_STARTED' || status === 'GENERATING') {
    return (
      <Card>
        <View style={styles.thinkingRow}>
          <TennisBallLoader size={28} />
          <ThemedText type="bodyMedium">Coach está pensando…</ThemedText>
        </View>
      </Card>
    );
  }

  if (status === 'FAILED') {
    return (
      <Card>
        <ThemedText type="bodyMedium">Não foi possível gerar a análise do coach.</ThemedText>
        {summary.data?.errorMessage ? (
          <ThemedText type="small" themeColor="textSecondary">
            {summary.data.errorMessage}
          </ThemedText>
        ) : null}
        <Button label="Tentar novamente" variant="secondary" loading={trigger.isPending} onPress={() => trigger.mutate()} />
      </Card>
    );
  }

  if (summary.data?.status === 'READY') {
    const { strengths = [], weakness, actionItem } = summary.data;

    return (
      <Card>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Coach
        </ThemedText>

        {strengths.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="label" themeColor="textSecondary">
              Pontos fortes
            </ThemedText>
            {strengths.map((strength) => (
              <ThemedText key={strength} type="default">
                • {strength}
              </ThemedText>
            ))}
          </View>
        ) : null}

        {weakness ? (
          <View style={styles.section}>
            <ThemedText type="label" themeColor="textSecondary">
              Ponto de atenção
            </ThemedText>
            <ThemedText type="default">{weakness}</ThemedText>
          </View>
        ) : null}

        {actionItem ? (
          <View style={styles.section}>
            <ThemedText type="label" themeColor="textSecondary">
              Próximo treino
            </ThemedText>
            <ThemedText type="default">{actionItem}</ThemedText>
          </View>
        ) : null}
      </Card>
    );
  }

  // No status at all yet (query not enabled, or still resolving the very
  // first fetch) — render nothing rather than a flash of empty UI.
  return null;
}

const styles = StyleSheet.create({
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  section: {
    gap: Spacing.half,
  },
});
