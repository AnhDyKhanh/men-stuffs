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
  updated_at: Date | null
}

export type CartItemStatus = 'active' | 'inactive' | string

export type CartItemsApiResponseData = {
  id: string
  cart_id: string
  product: CartProduct
  quantity: number
  price_at_time: number
  created_at: Date
}

export type CartProduct = {
  id: string
  name: string
  price: number
  image: string
}

export type CartItemWithCartAndProduct = CartItem & {
  cart?: Cart | null
  product?: Product | null
}
