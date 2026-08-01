import '@/global.css';

import { Platform } from 'react-native';

/**
 * "Premium tennis club" palette ported from matchbook-old (app/globals.css + inline tokens).
 * The old web app has no dark mode, so dark is aliased to light rather than inventing an
 * undesigned theme this pass — see app.json's userInterfaceStyle:"light".
 */
const palette = {
  text: '#12231d',
  textSecondary: '#64748b',
  background: '#f8f5eb',
  backgroundElement: '#f5efe0',
  backgroundSelected: '#fdfaf1',
  card: '#ffffff',
  border: 'rgba(18, 35, 29, 0.08)',

  forestDeep: '#10271f',
  forestMid: '#16302b',
  forestPanel: '#12372d',
  slateDark: '#0f172a',

  gold: '#f7d56b',
  goldForeground: '#3d2c05',
  ballGreen: '#cce000',
  cream: '#fff8eb',

  win: '#059669',
  winBackground: '#d1fae5',
  loss: '#e11d48',
  lossBackground: '#ffe4e6',
} as const;

export const Colors = {
  light: palette,
  dark: palette,
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
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
  display: 'SpaceGrotesk_500Medium',
  displaySemiBold: 'SpaceGrotesk_600SemiBold',
  displayBold: 'SpaceGrotesk_700Bold',
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
  xl: 28,
  xxl: 32,
  full: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
