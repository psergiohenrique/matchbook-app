import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TennisBallLoader } from '@/components/ui/tennis-ball-loader';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
};

function getVariantStyles(
  theme: ReturnType<typeof useTheme>,
): Record<ButtonVariant, { background: string; text: string; border?: string }> {
  return {
    primary: { background: theme.accent, text: theme.accentText },
    secondary: { background: theme.hero, text: theme.heroText },
    ghost: { background: 'transparent', text: theme.hero, border: theme.border },
    danger: { background: theme.danger, text: '#ffffff' },
  };
}

export function Button({
  label,
  variant = 'primary',
  loading,
  fullWidth,
  icon,
  disabled,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const colors = getVariantStyles(theme)[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: colors.background,
          borderWidth: colors.border ? 1.5 : 0,
          borderColor: colors.border,
        },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
      {...rest}>
      {loading ? (
        <TennisBallLoader size={20} color={colors.text} />
      ) : (
        <View style={styles.content}>
          {icon}
          <ThemedText type="bodyMedium" style={[styles.label, { color: colors.text }]}>
            {label}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});
