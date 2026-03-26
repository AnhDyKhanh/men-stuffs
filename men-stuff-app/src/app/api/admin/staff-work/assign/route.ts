import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { assignStaffToOrder } from './services/assignStaffToOrder'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const orderId = body?.orderId as string | undefined
  const assignedToStaffId = body?.staffId as string | undefined

  const cookieStore = await cookies()
  const createdByAccountId = cookieStore.get('account_id')?.value ?? null

  if (!createdByAccountId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await assignStaffToOrder({
    orderId: orderId ?? '',
    assignedToStaffId: assignedToStaffId ?? '',
    createdByAccountId,
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

