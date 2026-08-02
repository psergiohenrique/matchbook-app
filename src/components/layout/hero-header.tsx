import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type HeroHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

/** Dark forest hero panel pattern reused across old app's dashboard/analytics/insights headers. */
export function HeroHeader({ eyebrow, title, subtitle, action }: HeroHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.hero }]}>
      <View style={styles.textColumn}>
        {eyebrow ? (
          <ThemedText type="label" style={{ color: theme.lime }}>
            {eyebrow}
          </ThemedText>
        ) : null}
        <ThemedText type="title" style={[styles.title, { color: theme.heroText }]}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" style={{ color: theme.heroSub }}>
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
  title: {
    fontSize: 26,
    lineHeight: 32,
  },
});
