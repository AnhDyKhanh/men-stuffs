/**
 * Internationalization (i18n) configuration and utilities
 * Following Next.js App Router best practices
 * 
 * Server-only module - dictionaries are only loaded on the server
 */

import 'server-only';

export type Locale = 'vi' | 'en';

// Import JSON to get the type
import viDict from '@/i18n/vi.json';

// Translation dictionary type
export type Dictionary = typeof viDict;

/**
 * Supported locales
 */
export const locales: Locale[] = ['vi', 'en'];
export const defaultLocale: Locale = 'vi';

/**
 * Get dictionary for a given locale
 * This function is server-only and should only be used in Server Components
 * 
 * @param lang - The locale code ('vi' or 'en')
 * @returns Promise resolving to the translation dictionary
 */
export async function getDictionary(lang: Locale): Promise<Dictionary> {
  try {
    const dictionaryModule = await import(`@/i18n/${lang}.json`);
    // Handle both default export and named export patterns
    const dictionary = 'default' in dictionaryModule
      ? dictionaryModule.default
      : dictionaryModule;
    return dictionary as Dictionary;
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${lang}`, error);
    // Fallback to default locale
    const fallbackModule = await import(`@/i18n/${defaultLocale}.json`);
    const fallback = 'default' in fallbackModule
      ? fallbackModule.default
      : fallbackModule;
    return fallback as Dictionary;
  }
}

/**
 * Get nested value from dictionary by key path
 * Supports nested keys like "common.home" or "admin.products"
 * 
 * @param dict - The dictionary object
 * @param path - Dot-separated key path
 * @returns The translated string or the key path if not found
 */
export function getNestedValue(dict: Dictionary, path: string): string {
  const keys = path.split('.');
  let current: unknown = dict;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof current === 'string' ? current : path;
}

/**
 * Type guard to check if a string is a valid locale
 */
export function isValidLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}
