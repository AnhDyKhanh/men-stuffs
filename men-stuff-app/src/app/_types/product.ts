export type ProductStatus = 'active' | 'inactive'

export type Product = {
  id: string
  category_id: string
  name_vi: string
  name_en: string
  price: number
  thumbnail: string
  status: ProductStatus
  createdAt: string
}