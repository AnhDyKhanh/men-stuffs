import { NextResponse } from 'next/server'
import { updateOrderStatus } from '../services/updateOrderStatus'
import type { OrderStatus } from '@/models/order'

type RouteContext = { params: Promise<{ id: string }> }

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
