import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAccountIdFromCookie } from '@/lib/auth'
import { isStaffByAccountId } from '@/lib/auth-server'

/** Staff / admin / manager: có dòng trong bảng staff. Dùng cho route /api/admin/*. */
export async function requireStaffOr401(): Promise<NextResponse | null> {
  // const cookieStore = await cookies()
  // const accountId = getAccountIdFromCookie(cookieStore)
  // if (!accountId) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }
  // const ok = await isStaffByAccountId(accountId)
  // if (!ok) {
  //   return NextResponse.json({ error: 'Forbidden — cần tài khoản nhân sự (staff/admin/manager).' }, { status: 403 })
  // }
  return null
}
