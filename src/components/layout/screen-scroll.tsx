import { ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';

type ScreenScrollProps = ScrollViewProps & {
  children: React.ReactNode;
};

/** Shared scroll container: safe-area padding, sand background, centered max-width column. */
export function ScreenScroll({ children, contentContainerStyle, style, ...rest }: ScreenScrollProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
        contentContainerStyle,
      ]}
      {...rest}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
});
