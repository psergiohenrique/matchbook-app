import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast, ErrorToast, type BaseToastProps } from 'react-native-toast-message';

import { SessionProvider } from '@/auth/session-context';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemeProvider } from '@/providers/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <BottomSheetModalProvider>
              {children}
              <ThemedToast />
            </BottomSheetModalProvider>
          </SessionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function ThemedToast() {
  const theme = useTheme();

  const toastBase = (props: BaseToastProps, accent: string) => (
    <BaseToast
      {...props}
      style={[styles.toast, { backgroundColor: theme.toastBg, borderColor: theme.border, borderLeftColor: accent }]}
      contentContainerStyle={styles.toastContent}
      text1Style={[styles.text1, { color: theme.text }]}
      text2Style={[styles.text2, { color: theme.textSecondary }]}
    />
  );

  return (
    <Toast
      config={{
        success: (props) => toastBase(props, theme.toastBorder),
        info: (props) => toastBase(props, theme.accent),
        error: (props) => (
          <ErrorToast
            {...props}
            style={[styles.toast, { backgroundColor: theme.toastBg, borderColor: theme.border, borderLeftColor: theme.danger }]}
            contentContainerStyle={styles.toastContent}
            text1Style={[styles.text1, { color: theme.text }]}
            text2Style={[styles.text2, { color: theme.textSecondary }]}
          />
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  toast: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderLeftWidth: 5,
    height: 'auto',
    minHeight: 56,
    paddingVertical: Spacing.two,
  },
  toastContent: {
    paddingHorizontal: Spacing.three,
  },
  text1: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
  },
  text2: {
    fontFamily: FontFamily.body,
    fontSize: 13,
  },
});
