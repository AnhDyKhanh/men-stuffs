import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAccountIdFromCookie } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getCurrentCustomerId } from '@/app/api/guest/services/getCustomerAccount'

const MAX_BYTES = 4 * 1024 * 1024 // 4MB
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const accountId = getAccountIdFromCookie(cookieStore)
  if (!accountId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const customerIdRaw = await getCurrentCustomerId().catch(() => null)
  const customerId = typeof customerIdRaw === 'string' ? customerIdRaw : null
  if (!customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'FormData không hợp lệ' }, { status: 400 })
  }

  const file = formData.get('image') as File | null
  if (!file || typeof file.arrayBuffer !== 'function') {
    return NextResponse.json({ error: 'Thiếu file ảnh' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Ảnh tối đa 4MB' }, { status: 400 })
  }

  const type = file.type || 'application/octet-stream'
  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: 'Chỉ nhận JPEG, PNG, WebP, GIF' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const ext = file.name.split('.').pop() || 'jpg'
  const safeCustomer = customerId.replace(/[^a-z0-9-]/gi, '').slice(0, 32)
  const fileName = `reviews/${safeCustomer}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const buf = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await supabase.storage.from('image').upload(fileName, buf, {
    contentType: type,
    upsert: false,
  })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('image').getPublicUrl(fileName)

  return NextResponse.json({ url: publicUrl }, { status: 200 })
}
