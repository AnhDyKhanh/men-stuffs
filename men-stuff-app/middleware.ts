import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isStaffByAccountId } from '@/lib/auth-server'
import { adminRoutePrefixes } from '@/constants/webRoute'
import { protectedUserRoutes } from '@/constants/webRoute'

const COOKIE_ACCOUNT_ID = 'account_id'

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


function isAdminRoute(pathname: string): boolean {
  return adminRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userRole = getUserRole(request)

  if (isAdminRoute(pathname)) {
    const accountId = getAccountId(request)
    const isStaff = accountId ? await isStaffByAccountId(accountId) : false
    if (!isStaff) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (isUserRoute(pathname)) {
    if (userRole === 'guest') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const response = NextResponse.next()
  response.headers.set('x-user-role', userRole)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
