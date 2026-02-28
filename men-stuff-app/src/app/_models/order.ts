import type { Customer } from './customer'
import type { Cart } from './cart'

/**
 * Order entity (table: orders)
 * Many-to-one with customer; one-to-one with cart (cart_id unique).
 */
export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled' | string

export type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | string

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | string

export type Order = {
  id: string
  customer_id: string | null
  cart_id: string | null
  total_amount: number | null
  status: OrderStatus | null
  order_code: string | null
  payment_method: PaymentMethod | null
  payment_status: PaymentStatus | null
  shipping_address: string | null
  receiver_name: string | null
  receiver_phone: string | null
  created_at: Date | null
}

export type OrderWithCustomerAndCart = Order & {
  customer?: Customer | null
  cart?: Cart | null
}
