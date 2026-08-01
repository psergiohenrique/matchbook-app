import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';

type HeroHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

/** Dark forest hero panel pattern reused across old app's dashboard/analytics/insights headers. */
export function HeroHeader({ eyebrow, title, subtitle, action }: HeroHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textColumn}>
        {eyebrow ? (
          <ThemedText type="label" style={styles.eyebrow}>
            {eyebrow}
          </ThemedText>
        ) : null}
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" style={styles.subtitle}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.forestMid,
    borderRadius: Radius.xxl,
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  textColumn: {
    flex: 1,
    gap: Spacing.one,
  },
  eyebrow: {
    color: Colors.light.gold,
  },
  title: {
    color: Colors.light.cream,
    fontSize: 26,
    lineHeight: 32,
  },
  subtitle: {
    color: 'rgba(255, 248, 235, 0.75)',
  },
});
