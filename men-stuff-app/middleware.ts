import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, isValidLocale } from '@/lib/i18n'
import { isStaffByAccountId } from '@/lib/auth-server'

const COOKIE_ACCOUNT_ID = 'account_id'

const protectedUserRoutes = ['/checkout', '/account']

function getUserRole(request: NextRequest): 'guest' | 'user' | 'admin' {
  const role = request.cookies.get('role')?.value
  if (role === 'user' || role === 'admin') return role
  return 'guest'
}

function getAccountId(request: NextRequest): string | undefined {
  return request.cookies.get(COOKIE_ACCOUNT_ID)?.value
}

function isUserRoute(pathname: string): boolean {
  return protectedUserRoutes.some((route) => pathname.includes(route))
}

/**
 * Extract locale from pathname
 */
function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0]
  }
  return null
}

/**
 * Remove locale from pathname
 */
function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return '/' + segments.slice(1).join('/')
  }
  return pathname
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathWithoutLocale = removeLocaleFromPath(pathname)
  const locale = getLocaleFromPath(pathname)

  // Handle root path - redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }

  // If path doesn't start with a locale, redirect
  if (!locale) {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  if (!isValidLocale(locale)) {
    const newUrl = new URL(`/${defaultLocale}${pathWithoutLocale}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  const userRole = getUserRole(request)

  // Admin routes: phải có account_id trong cookie VÀ bảng staff có bản ghi với account_id đó
  if (
    pathWithoutLocale.startsWith('/admin') ||
    pathWithoutLocale.startsWith('/dashboard') ||
    pathWithoutLocale.startsWith('/products-management') ||
    pathWithoutLocale.startsWith('/categories-management')
  ) {
    const accountId = getAccountId(request)
    const isStaff = accountId ? await isStaffByAccountId(accountId) : false
    if (!isStaff) {
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Check user routes (checkout, account)
  if (isUserRoute(pathWithoutLocale)) {
    if (userRole === 'guest') {
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Add locale to request headers for use in components
  const response = NextResponse.next()
  response.headers.set('x-locale', locale)
  response.headers.set('x-user-role', userRole)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
