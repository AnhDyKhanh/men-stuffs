import type { Customer } from './customer'
import type { Product } from './product'
import type { Order } from './order'

/**
 * Feedback entity (table: feedback)
 * Many-to-one with customer, product, and order.
 */
export type Feedback = {
  id: string
  customer_id: string | null
  product_id: string | null
  order_id: string | null
  rating: number | null
  comment: string | null
  created_at: Date | null
  updated_at: Date | null
}

export type FeedbackWithRelations = Feedback & {
  customer?: Customer | null
  product?: Product | null
  order?: Order | null
}
