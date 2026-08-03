const THEME_KEY = 'matchbook.themeOverride';

export const themeStore = {
  get: async () => window.localStorage.getItem(THEME_KEY),
  set: async (scheme: 'light' | 'dark') => window.localStorage.setItem(THEME_KEY, scheme),
};
