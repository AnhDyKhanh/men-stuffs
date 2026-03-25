import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/auth/me - Returns current user and role from cookies (custom auth).
 */
export async function GET(request: NextRequest) {
  const accountId = request.cookies.get('account_id')?.value
  const role = request.cookies.get('role')?.value

  if (!accountId || !role) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true, accountId, role }, { status: 200 })
}
