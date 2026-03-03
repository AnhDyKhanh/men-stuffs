import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { isStaffByAccountId } from '@/lib/auth-server'

const ACCOUNT_TABLE = 'account'
const COOKIE_ACCOUNT_ID = 'account_id'
const COOKIE_ROLE = 'role'
const COOKIE_MAX_AGE = 86400 // 24h

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    const supabase = getSupabase()

    const { data: account, error: accountError } = await supabase
      .from(ACCOUNT_TABLE)
      .select('id, password')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (accountError || !account) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      )
    }

    if (account.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      )
    }

    const isStaff = await isStaffByAccountId(account.id)
    const role = isStaff ? 'admin' : 'user'

    const response = NextResponse.json({ success: true, role }, { status: 200 })
    response.cookies.set(COOKIE_ACCOUNT_ID, account.id, {
      httpOnly: true,
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    })
    response.cookies.set(COOKIE_ROLE, role, {
      httpOnly: true,
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
