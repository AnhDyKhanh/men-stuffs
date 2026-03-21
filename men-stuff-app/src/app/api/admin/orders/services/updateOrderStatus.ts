import { getSupabaseAdmin } from '@/lib/supabase'
import type { OrderStatus } from '@/models/order'

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select('id').single()

  if (error) {
    console.error('[updateOrderStatus]', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
