/**
 * Route constants for the application
 * Centralized route definitions to avoid hardcoding routes throughout the codebase
 *
 * All routes automatically use the current lang from context
 * Example: `ROUTES.STORE.HOME()` => `/${currentLang}`
 */

import { defaultLocale, isValidLocale, type Locale } from '@/lib/i18n'
import { headers } from 'next/headers'

/**
 * Get current lang from headers (for Server Components)
 * Falls back to default lang if not found
 */
export async function getCurrentLang(): Promise<Locale> {
  try {
    const headersList = await headers()
    const lang = headersList.get('x-locale')
    if (lang && isValidLocale(lang)) {
      return lang
    }
  } catch (error) {
    // If headers() fails (e.g., in client component), return default
  }
  return defaultLocale
}

/**
 * Hook to get current lang (for Client Components)
 * Usage: const lang = useCurrentLang();
 *
 * Note: This hook must be used in a client component marked with 'use client'
 */
export function useCurrentLang(): Locale {
  if (typeof window === 'undefined') {
    // Server-side: return default, should use getCurrentLang() instead
    return defaultLocale
  }

  // Client-side: extract from pathname
  const pathname = window.location.pathname
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0] as Locale
  }
  return defaultLocale
}

/**
 * Generate a localized route path
 */
function localizeRoute(lang: Locale, path: string): string {
  return `/${lang}${path}`
}

/**
 * Store routes - Customer-facing pages
 * All functions automatically use current locale from context
 */
export const STORE_ROUTES = {
  /**
   * Home page
   * @example await STORE_ROUTES.HOME() => "/vi" (or current lang)
   */
  HOME: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '')
  },

  /**
   * Products listing page
   * @example await STORE_ROUTES.PRODUCTS() => "/vi/products" (or current lang)
   */
  PRODUCTS: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/products')
  },

  /**
   * Single product detail page
   * @example await STORE_ROUTES.PRODUCT("product-slug") => "/vi/product/product-slug"
   */
  PRODUCT: async (slug: string) => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, `/product/${slug}`)
  },

  /**
   * Shopping cart page
   * @example await STORE_ROUTES.CART() => "/vi/cart" (or current lang)
   */
  CART: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/cart')
  },

  /**
   * Checkout page
   * @example await STORE_ROUTES.CHECKOUT() => "/vi/checkout" (or current lang)
   */
  CHECKOUT: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/checkout')
  },

  /**
   * User account page
   * @example await STORE_ROUTES.ACCOUNT() => "/vi/account" (or current lang)
   */
  ACCOUNT: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/account')
  },
} as const

/**
 * Admin routes - Admin dashboard pages
 * All functions automatically use current locale from context
 */
export const ADMIN_ROUTES = {
  /**
   * Admin dashboard home
   * @example await ADMIN_ROUTES.DASHBOARD() => "/vi/dashboard" (or current lang)
   */
  DASHBOARD: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/dashboard')
  },

  /**
   * Products management listing
   * @example await ADMIN_ROUTES.PRODUCTS() => "/vi/products-management" (or current lang)
   */
  PRODUCTS: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/products-management')
  },

  /**
   * Create new product
   * @example await ADMIN_ROUTES.PRODUCT_NEW() => "/vi/products-management/new" (or current lang)
   */
  PRODUCT_NEW: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/products-management/new')
  },

  /**
   * Edit existing product
   * @example await ADMIN_ROUTES.PRODUCT_EDIT("123") => "/vi/products-management/123" (or current lang)
   */
  PRODUCT_EDIT: async (id: string) => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, `/products-management/${id}`)
  },
} as const

/**
 * Auth routes
 * All functions automatically use current locale from context
 */
export const AUTH_ROUTES = {
  /**
   * Login page
   * @example await AUTH_ROUTES.LOGIN() => "/vi/login" (or current lang)
   */
  LOGIN: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/login')
  },

  /**
   * Login page with redirect parameter
   * @example await AUTH_ROUTES.LOGIN_WITH_REDIRECT("/vi/products") => "/vi/login?redirect=/vi/products"
   */
  LOGIN_WITH_REDIRECT: async (redirectPath: string) => {
    const lang = await getCurrentLang()
    return `${localizeRoute(lang, '/login')}?redirect=${encodeURIComponent(redirectPath)}`
  },
} as const

/**
 * Static pages routes
 * All functions automatically use current locale from context
 */
export const PAGES_ROUTES = {
  /**
   * About page
   * @example await PAGES_ROUTES.ABOUT() => "/vi/pages/about" (or current lang)
   */
  ABOUT: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/pages/about')
  },

  /**
   * Contact page
   * @example await PAGES_ROUTES.CONTACT() => "/vi/pages/contact" (or current lang)
   */
  CONTACT: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/pages/contact')
  },

  /**
   * Delivery policy page
   * @example await PAGES_ROUTES.DELIVERY_POLICY() => "/vi/pages/policies/delivery" (or current lang)
   */
  DELIVERY_POLICY: async () => {
    const lang = await getCurrentLang()
    return localizeRoute(lang, '/pages/policies/delivery')
  },
} as const

/**
 * All routes grouped by category
 * For convenience, use this object to access all route categories
 */
export const ROUTES = {
  STORE: STORE_ROUTES,
  ADMIN: ADMIN_ROUTES,
  AUTH: AUTH_ROUTES,
  PAGES: PAGES_ROUTES,
} as const

/**
 * Route path templates (without locale)
 * Use these for route matching, redirects, or when you need the path pattern
 */
export const ROUTE_PATHS = {
  STORE: {
    HOME: '',
    PRODUCTS: '/products',
    PRODUCT: '/product/:slug',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ACCOUNT: '/account',
  },
  ADMIN: {
    DASHBOARD: '/dashboard',
    PRODUCTS: '/products-management',
    PRODUCT_NEW: '/products-management/new',
    PRODUCT_EDIT: '/products-management/:id',
  },
  AUTH: {
    LOGIN: '/login',
  },
  PAGES: {
    ABOUT: '/pages/about',
    CONTACT: '/pages/contact',
    DELIVERY_POLICY: '/pages/policies/delivery',
  },
} as const
