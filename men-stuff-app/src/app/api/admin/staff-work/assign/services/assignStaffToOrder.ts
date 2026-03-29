import { getSupabaseAdmin } from '@/lib/supabase'
import { getStaffIdByAccountId } from '@/lib/auth-server'

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

  // Kiểm tra đơn tồn tại và còn gán được.
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, status')
    .eq('id', orderId)
    .single()

  if (orderError) return { ok: false, error: orderError.message }
  if (!order) return { ok: false, error: 'Không tìm thấy đơn hàng' }

  if (order.status === 'cancelled') return { ok: false, error: 'Đơn đã hủy' }
  if (order.status === 'delivered') return { ok: false, error: 'Đơn đã giao xong' }

  // 1) Cập nhật nhân viên được giao trên bản ghi staff_work đã gắn với đơn (không tạo mới).
  const { data: updatedRows, error: updateWorkError } = await supabase
    .from('staff_work')
    .update({ assigned_to: assignedToStaffId })
    .eq('related_order_id', orderId)
    .select('id')

  if (updateWorkError) return { ok: false, error: updateWorkError.message }
  if (!updatedRows?.length) {
    return {
      ok: false,
      error: 'Chưa có công việc gắn với đơn hàng này. Hãy tạo staff_work trước khi gán nhân viên.',
    }
  }

  // 2) Cập nhật order status sang shipping.
  const { error: updateOrderError } = await supabase
    .from('orders')
    .update({ status: NEXT_ORDER_STATUS })
    .eq('id', orderId)

  if (updateOrderError) return { ok: false, error: updateOrderError.message }

  return { ok: true }
}

