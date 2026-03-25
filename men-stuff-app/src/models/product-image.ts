import type { Product } from './product'

/**
 * ProductImage entity (table: product_image)
 * Many-to-one with product.
 */
export type ProductImage = {
  id: string
  product_id: string | null
  image_url: string | null
  is_primary: boolean | null
}

export type ProductImageWithProduct = ProductImage & {
  product?: Product | null
}
