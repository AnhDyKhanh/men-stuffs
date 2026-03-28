export type HistoryProduct = {
  id: string
  name: string
  origin_image: string | null
  slug: string | null
}

export type HistoryReview = {
  id: string
  rating: number
  comment: string | null
  image_urls: string[]
  created_at: string
}

export type HistoryLine = {
  id: string
  product_id: string
  quantity: number
  price: number
  product: HistoryProduct | null
  review: HistoryReview | null
}

export type HistoryOrder = {
  id: string
  order_code: string | null
  status: string | null
  created_at: string | null
  total_amount: number | null
  items: HistoryLine[]
}
