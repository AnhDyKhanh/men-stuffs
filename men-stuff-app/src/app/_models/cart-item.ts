import type { Cart } from './cart'
import type { Product } from './product'

/**
 * CartItem entity (table: cart_items)
 * Many-to-one with cart and product.
 */
export type CartItem = {
  id: string
  cart_id: string | null
  product_id: string | null
  quantity: number | null
  price_at_time: number | null
  created_at: Date | null
}

export type CartItemWithCartAndProduct = CartItem & {
  cart?: Cart | null
  product?: Product | null
}
