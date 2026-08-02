import { Colors } from '@/constants/theme';
import { useThemeScheme } from '@/providers/theme-provider';

export function useTheme() {
  const { scheme } = useThemeScheme();

  return Colors[scheme];
}
