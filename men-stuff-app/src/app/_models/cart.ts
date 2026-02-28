import type { Customer } from './customer'

/**
 * Cart entity (table: cart)
 * Many-to-one with customer; one-to-one with orders (cart_id unique).
 */
export type CartStatus = 'active' | 'abandoned' | 'converted' | string

export type Cart = {
  id: string
  customer_id: string | null
  status: CartStatus | null
  created_at: Date | null
}

export type CartWithCustomer = Cart & {
  customer?: Customer | null
}
