import { getSupabase } from '@/lib/supabase'
import { getCurrentCustomerId } from '../../services/getCustomerAccount'
import { isProcessingOrder } from '@/constants/orderStatus'

type GuestOrder = {
  id: string
  order_code: string | null
  status: string | null
  created_at: string | null
  total_amount: number | null
}

export async function getCustomerOrders() {
  const customerIdRaw = await getCurrentCustomerId().catch(() => null)
  const customerId = typeof customerIdRaw === 'string' ? customerIdRaw : null

  if (!customerId) {
    return { data: { orders: [], processingCount: 0 }, error: 'Unauthorized', status: 401 }
  }

  const { data, error } = await getSupabase()
    .from('orders')
    .select('id, order_code, status, created_at, total_amount')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return { data: { orders: [], processingCount: 0 }, error: error.message, status: 500 }
  }

  const orders = (data ?? []) as GuestOrder[]
  const processingCount = orders.filter((order) => isProcessingOrder(order.status)).length

  return {
    data: { orders, processingCount },
    error: null,
    status: 200,
  }
}

