import * as SecureStore from 'expo-secure-store';

const THEME_KEY = 'matchbook.themeOverride';

export const themeStore = {
  get: () => SecureStore.getItemAsync(THEME_KEY),
  set: (scheme: 'light' | 'dark') => SecureStore.setItemAsync(THEME_KEY, scheme),
};
