import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, FontFamily, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'bodyMedium'
    | 'title'
    | 'heading'
    | 'small'
    | 'smallBold'
    | 'label'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'bodyMedium' && styles.bodyMedium,
        type === 'title' && styles.title,
        type === 'heading' && styles.heading,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'label' && styles.label,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  default: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: 34,
    lineHeight: 40,
  },
  heading: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: 22,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  link: {
    fontFamily: FontFamily.bodyMedium,
    lineHeight: 22,
    fontSize: 14,
  },
  linkPrimary: {
    fontFamily: FontFamily.bodySemiBold,
    lineHeight: 22,
    fontSize: 14,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
