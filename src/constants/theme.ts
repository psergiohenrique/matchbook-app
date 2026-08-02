import '@/global.css';

import { Platform } from 'react-native';

/**
 * "Court redesign" palette — deep forest green + terracotta accent + tennis-ball lime,
 * ported from the Matchbook Tennis Claude Design mockup. Both light and dark are real,
 * independent palettes (see providers/theme-provider.tsx for the manual toggle).
 */
const light = {
  text: '#152A21',
  textSecondary: '#5B6B62',
  background: '#FAF8F2',
  backgroundElement: '#F1EEE3',
  backgroundSelected: '#F1EEE3',
  card: '#FFFFFF',
  border: '#E7E2D3',
  placeholder: '#96A199',

  hero: '#123C2E',
  heroText: '#FAF8F2',
  heroSub: 'rgba(250, 248, 242, 0.75)',
  navInactive: 'rgba(250, 248, 242, 0.55)',

  accent: '#E1592C',
  accentText: '#FFFFFF',
  lime: '#CFE83A',
  limeText: '#12241D',

  toastBg: '#FFFFFF',
  toastBorder: '#4C9A6A',
  success: '#4C9A6A',
  danger: '#D64545',
} as const;

const dark = {
  text: '#F4F1E7',
  textSecondary: '#A9B8AE',
  background: '#0D1F19',
  backgroundElement: '#1E3B32',
  backgroundSelected: '#1E3B32',
  card: '#16302A',
  border: '#274038',
  placeholder: '#7C8C82',

  hero: '#0A1F18',
  heroText: '#F4F1E7',
  heroSub: 'rgba(244, 241, 231, 0.7)',
  navInactive: 'rgba(244, 241, 231, 0.5)',

  accent: '#FF6B3D',
  accentText: '#161616',
  lime: '#E3FF5B',
  limeText: '#12241D',

  toastBg: '#16302A',
  toastBorder: '#7CD98E',
  success: '#7CD98E',
  danger: '#FF6B6B',
} as const;

export const Colors = {
  light,
  dark,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/** Brand typefaces, loaded via useFonts() in the root layout (@expo-google-fonts/*). */
export const FontFamily = {
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemiBold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
  display: 'BricolageGrotesque_500Medium',
  displaySemiBold: 'BricolageGrotesque_600SemiBold',
  displayBold: 'BricolageGrotesque_700Bold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 20,
  xxl: 32,
  full: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
