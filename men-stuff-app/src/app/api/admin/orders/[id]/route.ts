import { NextResponse } from 'next/server'
import { updateOrderStatus } from '../services/updateOrderStatus'
import type { OrderStatus } from '@/models/order'
import { getOrderDetail } from '../services/getOrderDetail'

type RouteContext = { params: Promise<{ id: string }> }

/**
 * GET /api/admin/orders/:id
 */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const result = await getOrderDetail(id)
  return NextResponse.json(result, { status: result.status ?? 500 })
}

/**
 * PATCH /api/admin/orders/:id
 * Body: { status: OrderStatus }
 */
export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  try {
    const body = await request.json()
    const status = body?.status as OrderStatus
    const result = await updateOrderStatus(id, status)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}
