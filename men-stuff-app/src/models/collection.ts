import type { Product } from './product'

export type Collection = {
  id: string
  name: string
  description: string | null
  created_at: Date | null
}

export type CollectionItem = {
  id: string
  collection_id: string
  product_id: string
}

export type CollectionWithProducts = Collection & {
  products?: Product[]
}

