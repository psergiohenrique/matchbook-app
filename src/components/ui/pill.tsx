import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';

type PillTone = 'neutral' | 'win' | 'loss' | 'gold';

type PillProps = {
  label: string;
  tone?: PillTone;
};

const toneStyles: Record<PillTone, { background: string; text: string }> = {
  neutral: { background: Colors.light.backgroundElement, text: Colors.light.text },
  win: { background: Colors.light.winBackground, text: Colors.light.win },
  loss: { background: Colors.light.lossBackground, text: Colors.light.loss },
  gold: { background: Colors.light.gold, text: Colors.light.goldForeground },
};

export function Pill({ label, tone = 'neutral' }: PillProps) {
  const colors = toneStyles[tone];

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
