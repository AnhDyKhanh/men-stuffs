import type { Category } from './category'

/**
 * Product entity (table: product)
 * Many-to-one with category.
 */
export type ProductStatus = 'active' | 'inactive'

export type Product = {
  id: string
  category_id: string | null
  name: string | null
  slug: string | null
  description: string | null
  price: number | null
  discount_price: number | null
  material: string | null
  is_active: ProductStatus | null
  created_at: Date | null
  updated_at: Date | null
  origin_image: string | null
}

export type ProductWithCategory = Product & {
  category?: Category | null
}
