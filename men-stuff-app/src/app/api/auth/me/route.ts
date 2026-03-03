import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserRole, getAccountIdFromCookie } from '@/lib/auth'

/**
 * GET /api/auth/me - Returns current user and role from cookies (custom auth).
 */
export async function GET() {
  const cookieStore = await cookies()
  const accountId = getAccountIdFromCookie(cookieStore)
  const role = getUserRole(cookieStore)
  return NextResponse.json({
    user: accountId ? { id: accountId } : null,
    role,
  })
}
