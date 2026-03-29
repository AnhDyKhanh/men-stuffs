import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

const ACCOUNT_TABLE = 'account'
const STAFF_TABLE = 'staff'
const COOKIE_ACCOUNT_ID = 'account_id'
const COOKIE_STAFF_ID = 'staff_id'
const COOKIE_ROLE = 'role'
const COOKIE_STAFF_ROLE = 'staff_role'
const COOKIE_MAX_AGE = 86400

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    const { data: account, error: accountError } = await supabase
      .from(ACCOUNT_TABLE)
      .select('id, password')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (accountError || !account) {
      return NextResponse.json({ error: 'Không tìm thấy Account' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, account.password ?? '')
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const { data: staffData } = await supabase
      .from(STAFF_TABLE)
      .select('id, role')
      .eq('account_id', account.id)
      .maybeSingle()

    const finalRole = staffData ? 'admin' : 'user'
    const response = NextResponse.json({ success: true, role: finalRole }, { status: 200 })

    const cookieOptions = {
      httpOnly: true,
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax' as const,
    }

    response.cookies.set(COOKIE_ACCOUNT_ID, account.id, cookieOptions)
    response.cookies.set(COOKIE_ROLE, finalRole, cookieOptions)

    if (staffData) {
      response.cookies.set(COOKIE_STAFF_ID, staffData.id, cookieOptions)
      response.cookies.set(COOKIE_STAFF_ROLE, staffData.role, cookieOptions)
    }

    console.log('response.cookies', response.cookies)

    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}