/**
 * Route constants for the application
 * Centralized route definitions (single locale, no lang prefix)
 */

/**
 * Store routes - Customer-facing pages
 */
export const STORE_ROUTES = {
  HOME: async () => '/',
  PRODUCTS: async () => '/products',
  PRODUCT: (slug: string) => `/product/${slug}`,
  CART: async () => '/cart',
  CHECKOUT: async () => '/checkout',
  ACCOUNT: async () => '/account',
} as const

/**
 * Admin routes - Admin dashboard pages
 */
export const ADMIN_ROUTES = {
  DASHBOARD: async () => '/dashboard',
  PRODUCTS: async () => '/products-management',
  PRODUCT_NEW: async () => '/products-management/new',
  PRODUCT_EDIT: (id: string) => `/products-management/${id}`,
} as const

/**
 * Auth routes
 */
export const AUTH_ROUTES = {
  LOGIN: async () => '/login',
  LOGIN_WITH_REDIRECT: (redirectPath: string) => `/login?redirect=${encodeURIComponent(redirectPath)}`,
} as const

/**
 * Static pages routes
 */
export const PAGES_ROUTES = {
  ABOUT: async () => '/pages/about',
  CONTACT: async () => '/pages/contact',
  DELIVERY_POLICY: async () => '/pages/policies/delivery',
} as const

export const ROUTES = {
  STORE: STORE_ROUTES,
  ADMIN: ADMIN_ROUTES,
  AUTH: AUTH_ROUTES,
  PAGES: PAGES_ROUTES,
} as const

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
