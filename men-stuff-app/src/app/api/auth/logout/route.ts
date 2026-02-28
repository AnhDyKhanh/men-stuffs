import { NextResponse } from 'next/server'

const COOKIE_ACCOUNT_ID = 'account_id'
const COOKIE_ROLE = 'role'

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 })
  response.cookies.set(COOKIE_ACCOUNT_ID, '', { path: '/', maxAge: 0 })
  response.cookies.set(COOKIE_ROLE, '', { path: '/', maxAge: 0 })
  return response
}
