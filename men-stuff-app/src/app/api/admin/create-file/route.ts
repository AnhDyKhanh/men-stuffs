import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase'
import { isStaffByAccountId } from '@/lib/auth-server'
import { uploadImage } from '../../services/uploadImage'

const COOKIE_ACCOUNT_ID = 'account_id'

// POST /api/admin/create-file
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const accountId = cookieStore.get(COOKIE_ACCOUNT_ID)?.value

    if (!accountId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isStaff = await isStaffByAccountId(accountId)
    if (!isStaff) {
      return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const result = await uploadImage(file)
    if ('error' in result) return NextResponse.json(result, { status: 500 })
    return NextResponse.json(result, { status: 200 })

  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
