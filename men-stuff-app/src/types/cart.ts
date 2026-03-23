export type GetUserCartItemsApiResponse = {
  data: {
    cartItems: CartItem[]
    cartId: string | null
  }
  error: string | null
  message: string
  status: number
}

export type CartItem = {
  id: string
  product_id: string
  quantity: number
  price: number
  product: Product
}

export type Product = {
  id: string
  name: string
  price: number
  discount_price: number
  description: string
  origin_image: string
}
