import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PillTone = 'neutral' | 'win' | 'loss' | 'gold';

type PillProps = {
  label: string;
  tone?: PillTone;
};

function getToneStyles(theme: ReturnType<typeof useTheme>): Record<PillTone, { background: string; text: string }> {
  return {
    neutral: { background: theme.backgroundElement, text: theme.text },
    win: { background: theme.lime, text: theme.limeText },
    loss: { background: theme.backgroundSelected, text: theme.textSecondary },
    gold: { background: theme.lime, text: theme.limeText },
  };
}

export function Pill({ label, tone = 'neutral' }: PillProps) {
  const theme = useTheme();
  const colors = getToneStyles(theme)[tone];

  return (
    <View style={[styles.pill, { backgroundColor: colors.background }]}>
      <ThemedText type="smallBold" style={{ color: colors.text }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    alignSelf: 'flex-start',
  },
});
