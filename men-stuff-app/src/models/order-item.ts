import type { Order } from './order'
import type { Product } from './product'

/**
 * OrderItem entity (table: order_item)
 * Many-to-one with order and product.
 */
export type OrderItem = {
  id: string
  order_id: string | null
  product_id: string | null
  quantity: number | null
  price: number | null
}

export type OrderItemWithOrderAndProduct = OrderItem & {
  order?: Order | null
  product?: Product | null
}
