export const adminRoutePrefixes = [
  '/admin',
  '/dashboard',
  '/products-management',
  '/categories-management',
  '/collections-management',
  '/order',
] as const

export const protectedUserRoutes = [
  '/checkout',
  '/account',
] as const
