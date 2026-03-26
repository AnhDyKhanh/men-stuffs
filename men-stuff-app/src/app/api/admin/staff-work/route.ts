import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAllStaffWork } from './services/getAllStaffWork'

/**
 * GET /api/admin/staff-work
 * Query: page, size, status, search, mine=1 (việc của nhân viên đang đăng nhập)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mine = searchParams.get('mine') === '1'
  let accountIdForMine: string | null = null
  if (mine) {
    const cookieStore = await cookies()
    accountIdForMine = cookieStore.get('account_id')?.value ?? null
  }

  const result = await getAllStaffWork({
    page: parseInt(searchParams.get('page') || '1', 10),
    size: parseInt(searchParams.get('size') || '20', 10),
    status: searchParams.get('status'),
    search: searchParams.get('search'),
    mine,
    accountIdForMine,
  })

  const status = result.status && result.status >= 400 ? result.status : 200
  return NextResponse.json(result, { status })
}
