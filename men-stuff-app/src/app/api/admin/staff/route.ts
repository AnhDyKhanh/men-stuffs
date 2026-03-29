import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getStaffIdByAccountId } from '@/lib/auth-server'
import { STAFF_ROLE } from '@/constants/staffRole'

/**
 * GET /api/admin/staff
 * Returns list of staff for dropdown (admin UI only).
 */
export async function GET(_request: Request) {
  const cookieStore = await cookies()
  const accountId = cookieStore.get('account_id')?.value ?? null
  const staffId = accountId ? await getStaffIdByAccountId(accountId) : null

  if (!staffId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // thêm điều kiện role là staff
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('staff')
    .select('id, full_name, phone, role')
    .eq('role', STAFF_ROLE.STAFF)
    .order('full_name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    data: data ?? [],
    total: (data ?? []).length,
    error: null,
    message: null,
    status: 200,
  })
}

