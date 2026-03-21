import { NextResponse } from 'next/server'
import { getAllOrders } from './services/getAllOrders'
import { updateOrderStatus } from './services/updateOrderStatus'
import type { OrderStatus } from '@/models/order'

/**
 * GET /api/admin/orders?page=0&size=20&status=pending
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(0, parseInt(searchParams.get('page') || '0', 10))
  const size = Math.min(100, Math.max(1, parseInt(searchParams.get('size') || '20', 10)))
  const status = searchParams.get('status')

  const result = await getAllOrders({ page, size, status })
  return NextResponse.json(result)
}

/**
 * PATCH /api/admin/orders
 * Body: { id: string, status: OrderStatus }
 */
export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; status?: OrderStatus }
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'Thiếu id hoặc status' }, { status: 400 })
    }

    const allowed: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']
    if (!allowed.includes(body.status as OrderStatus)) {
      return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 })
    }

    const result = await updateOrderStatus(body.id, body.status)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}
