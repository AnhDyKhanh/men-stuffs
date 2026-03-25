import { getSupabaseAdmin } from '@/lib/supabase'
import type { OrderStatus } from '@/models/order'

const ALLOWED: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ ok: boolean; error: string | null }> {
  if (!orderId?.trim()) {
    return { ok: false, error: 'Thiếu mã đơn hàng' }
  }
  if (!ALLOWED.includes(status)) {
    return { ok: false, error: 'Trạng thái không hợp lệ' }
  }

  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)

    if (error) throw error
    return { ok: true, error: null }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Cập nhật thất bại'
    return { ok: false, error: msg }
  }
}
