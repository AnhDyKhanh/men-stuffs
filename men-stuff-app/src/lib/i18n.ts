/**
 * Simple i18n helper for translations
 * Loads JSON translation files based on locale
 */

type Locale = 'vi' | 'en';
type TranslationKey = string;

// Cache for loaded translations
const translationCache: Record<Locale, Record<string, any> | null> = {
  vi: null,
  en: null,
};

/**
 * Load translations for a given locale
 */
async function loadTranslations(locale: Locale): Promise<Record<string, any>> {
  if (translationCache[locale]) {
    return translationCache[locale]!;
  }

  try {
    const translations = await import(`@/i18n/${locale}.json`);
    translationCache[locale] = translations.default;
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    return {};
  }
}

/**
 * Get translation value by key path (e.g., "common.home" or "home.title")
 */
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

/**
 * Hook-like function to get translations (for use in Server Components)
 * Usage: const t = await useTranslations('vi'); t('common.home')
 */
export async function useTranslations(locale: Locale) {
  const translations = await loadTranslations(locale);
  
  return (key: TranslationKey): string => {
    return getNestedValue(translations, key);
  };
}

/**
 * Get translations synchronously (for Client Components)
 * Note: This requires translations to be pre-loaded
 */
export function getTranslations(locale: Locale, translations: Record<string, any>) {
  return (key: TranslationKey): string => {
    return getNestedValue(translations, key);
  };
}

/**
 * Supported locales
 */
export const locales: Locale[] = ['vi', 'en'];
export const defaultLocale: Locale = 'vi';

