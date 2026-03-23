import { getSupabaseAdmin } from '@/lib/supabase'
import type { Data } from '@/types/response.type'

type OrderDetailItem = {
  id: string
  quantity: number
  price_at_time: number
  product: {
    id: string
    name: string
    origin_image: string | null
  } | null
}

type OrderDetailData = {
  id: string
  order_code: string | null
  receiver_name: string | null
  receiver_phone: string | null
  shipping_address: string | null
  total_amount: number | null
  status: string | null
  created_at: string | null
  items: OrderDetailItem[]
}

export async function getOrderDetail(orderId: string): Promise<Data<OrderDetailData>> {
  if (!orderId?.trim()) {
    return {
      data: null,
      error: 'Thiếu mã đơn hàng',
      message: null,
      status: 400,
    }
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_code, receiver_name, receiver_phone, shipping_address, total_amount, status, created_at, cart_id')
      .eq('id', orderId)
      .single()

    if (orderError) throw orderError

    const { data: rawItems, error: itemsError } = await supabase
      .from('cart_items')
      .select('id, quantity, price_at_time, product:product_id(id, name, origin_image)')
      .eq('cart_id', order.cart_id)

    if (itemsError) throw itemsError

    const items: OrderDetailItem[] = (rawItems ?? []).map((item: any) => ({
      id: String(item.id),
      quantity: Number(item.quantity ?? 0),
      price_at_time: Number(item.price_at_time ?? 0),
      product: item.product
        ? {
            id: String(item.product.id),
            name: String(item.product.name ?? ''),
            origin_image: item.product.origin_image ?? null,
          }
        : null,
    }))

    return {
      data: {
        id: String(order.id),
        order_code: order.order_code ?? null,
        receiver_name: order.receiver_name ?? null,
        receiver_phone: order.receiver_phone ?? null,
        shipping_address: order.shipping_address ?? null,
        total_amount: order.total_amount ?? null,
        status: order.status ?? null,
        created_at: order.created_at ?? null,
        items,
      },
      error: null,
      message: null,
      status: 200,
    }
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Không lấy được chi tiết đơn hàng',
      message: null,
      status: 500,
    }
  }
}
