import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase'
import { isStaffByAccountId } from '@/lib/auth-server'

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

    const supabase = getSupabaseAdmin()

    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('image')
      .upload(filePath, file)

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('image').getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
