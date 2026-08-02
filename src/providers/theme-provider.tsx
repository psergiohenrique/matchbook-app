import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { themeStore } from '@/theme/theme-store';

type Scheme = 'light' | 'dark';

type ThemeContextValue = {
  scheme: Scheme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<Scheme | null>(null);

  useEffect(() => {
    let cancelled = false;

    themeStore.get().then((stored) => {
      if (!cancelled && (stored === 'light' || stored === 'dark')) {
        setOverride(stored);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const scheme: Scheme = override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const toggle = useCallback(() => {
    const next: Scheme = scheme === 'dark' ? 'light' : 'dark';
    setOverride(next);
    themeStore.set(next);
  }, [scheme]);

  const value = useMemo<ThemeContextValue>(() => ({ scheme, toggle }), [scheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeScheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeScheme must be used within a ThemeProvider');
  }
  return context;
}
