/**
 * Device locale (e.g. "pt-BR"), sent as `Accept-Language` so the backend's
 * AI coach responds in the user's language. Hermes ships with full ICU on
 * this Expo SDK, so `Intl` reflects the device locale without adding
 * expo-localization as a dependency. Falls back to "en" if `Intl` is
 * unavailable or throws.
 */
export function getDeviceLocale(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale || 'en';
  } catch {
    return 'en';
  }
}
