import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = ViewProps & {
  variant?: 'default' | 'dark' | 'flat';
};

/** Rounded glassy card wrapper, ported from matchbook-old's ui/card.tsx (rounded-[28px]). */
export function Card({ style, variant = 'default', ...rest }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.base,
        variant === 'default' && { backgroundColor: theme.card },
        variant === 'dark' && { backgroundColor: theme.hero },
        variant === 'flat' && { backgroundColor: theme.backgroundElement },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: '#12231d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
});
