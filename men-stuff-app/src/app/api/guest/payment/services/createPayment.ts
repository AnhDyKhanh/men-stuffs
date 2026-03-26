import { getSupabase } from '@/lib/supabase'
import { getCurrentCustomerId } from '../../services/getCustomerAccount'
import type { PaymentMethod, PaymentStatus } from '@/models/order'
import { CartStatus } from '@/enum/cart.enum'

export type CreateOrderItemDTO = {
  product_id: string
  quantity: number
  price: number
}

export type CreateOrderDTO = {
  cart_id: string
  total_amount: number
  payment_method: PaymentMethod
  payment_status?: PaymentStatus
  delivery_method?: 'pickup_at_shop' | 'home_delivery'
  shipping_address: string
  receiver_name: string
  receiver_phone: string
  items: CreateOrderItemDTO[]
}

export async function createOrder(body: CreateOrderDTO) {
  const {
    cart_id,
    total_amount,
    payment_method,
    payment_status = 'pending',
    delivery_method = 'pickup_at_shop',
    shipping_address,
    receiver_name,
    receiver_phone,
    items,
  } = body

  if (!items?.length) {
    return { data: null, error: 'Danh sách sản phẩm không được rỗng', status: 400 }
  }

  if (!cart_id) {
    return { data: null, error: 'Cart ID không được rỗng', status: 400 }
  }

  const supabase = getSupabase()

  try {
    const customerId = await getCurrentCustomerId().catch(() => null)

    if (!customerId) {
      return { data: null, error: 'Unauthorized', status: 401 }
    }

    // Bước 1: Tạo Order trước
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId ?? null,
        cart_id: cart_id || null,
        total_amount,
        status: 'pending',
        payment_method,
        payment_status,
        shipping_address:
          delivery_method === 'pickup_at_shop'
            ? `Nhận tại shop - ${shipping_address || 'Showroom Men Stuffs'}`
            : shipping_address,
        receiver_name,
        receiver_phone,
      })
      .select('id, order_code')
      .single()

    if (orderError) throw orderError
    const orderId = orderData?.id

    // Bước 2: Chuẩn bị dữ liệu items
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    // Bước 3: Chèn items vào bảng order_item
    const { error: itemsError } = await supabase.from('order_item').insert(orderItems)

    // Bước 4: Xử lý "Bẫy lỗi" (Manual Rollback)
    // Nếu chèn items lỗi, phải xóa cái Order vừa tạo để tránh đơn hàng rác
    if (itemsError) {
      await supabase.from('orders').delete().eq('id', orderId)
      throw itemsError
    }

    // Bước 5: Set status của cart tương ứng là inactive
    const { error: cartError } = await supabase
      .from('cart')
      .update({ status: CartStatus.INACTIVE })
      .eq('id', cart_id)

    if (cartError) {
      // Rollback order và order_items
      await supabase.from('order_item').delete().eq('order_id', orderId)
      await supabase.from('orders').delete().eq('id', orderId)
      throw cartError
    }

    return {
      data: { id: orderId, order_code: orderData?.order_code ?? null },
      error: null,
      status: 200,
    }
  } catch (err: unknown) {
    console.error('[createOrder Error]:', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Lỗi hệ thống khi tạo đơn hàng',
      status: 500,
    }
  }
}
