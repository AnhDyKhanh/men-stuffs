import { getSupabaseAdmin } from '@/lib/supabase'
import { getStaffIdByAccountId } from '@/lib/auth-server'
import type { StaffWorkStatus } from '@/models/staff-work'
import { randomUUID } from 'crypto'

const NEXT_ORDER_STATUS = 'shipping'

export type AssignStaffToOrderOptions = {
  orderId: string
  assignedToStaffId: string
  createdByAccountId: string
}

export async function assignStaffToOrder(
  options: AssignStaffToOrderOptions,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { orderId, assignedToStaffId, createdByAccountId } = options

  if (!orderId?.trim()) return { ok: false, error: 'Thiếu mã đơn hàng' }
  if (!assignedToStaffId?.trim()) return { ok: false, error: 'Thiếu staff được giao' }

  const createdByStaffId = await getStaffIdByAccountId(createdByAccountId)
  if (!createdByStaffId) return { ok: false, error: 'Unauthorized' }

  const supabase = getSupabaseAdmin()

  // Lấy thông tin đơn để tạo title/description cho staff_work.
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, order_code, receiver_name, receiver_phone, shipping_address, status')
    .eq('id', orderId)
    .single()

  if (orderError) return { ok: false, error: orderError.message }
  if (!order) return { ok: false, error: 'Không tìm thấy đơn hàng' }

  if (order.status === 'cancelled') return { ok: false, error: 'Đơn đã hủy' }
  if (order.status === 'delivered') return { ok: false, error: 'Đơn đã giao xong' }

  // 1) Cập nhật order status sang shipping.
  const { error: updateOrderError } = await supabase
    .from('orders')
    .update({ status: NEXT_ORDER_STATUS })
    .eq('id', orderId)

  if (updateOrderError) return { ok: false, error: updateOrderError.message }

  // 2) Tạo staff_work.
  const title = `Giao đơn ${order.order_code ?? String(order.id).slice(0, 8)}`
  const descriptionParts = [
    order.receiver_name ?? null,
    order.receiver_phone ?? null,
    order.shipping_address ?? null,
  ].filter(Boolean)
  const description = descriptionParts.join(' - ') || null

  const defaultTaskStatus: StaffWorkStatus = 'pending'

  const { error: insertError } = await supabase.from('staff_work').insert({
    // Tránh trường hợp staff_work.id không có default gen_random_uuid trong DB.
    id: randomUUID(),
    assigned_to: assignedToStaffId,
    created_by: createdByStaffId,
    related_order_id: orderId,
    title,
    description,
    status: defaultTaskStatus,
    task_type: 'fulfillment',
  })

  if (insertError) return { ok: false, error: insertError.message }

  return { ok: true }
}

