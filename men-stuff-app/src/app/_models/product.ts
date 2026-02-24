export type ProductStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

export type Product = {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  price: number
  discount_price: number
  material: string
  is_active: ProductStatus
  created_at: string
}