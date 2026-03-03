/**
 * Chỉ hỗ trợ tiếng Việt. Giữ lại defaultLocale và isValidLocale cho middleware/routing.
 */
export const defaultLocale = 'vi'
export const locales = ['vi'] as const
export type Locale = (typeof locales)[number]

export function isValidLocale(lang: string): lang is Locale {
  return lang === 'vi'
}
