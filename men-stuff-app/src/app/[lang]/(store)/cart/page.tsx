'use client'

import { useGetCustomerCurrentCart } from '@/app/_hooks/getCustomerCurrentCart'
import { BASE_PATH } from '@/lib/labels'
import Link from 'next/link'
import CartPageClient from './_components/CartPageClient'

// export type GetUserCartItemsApiResponse = {
//   data: {
//     cartItems: CartItem[]
//     cartId: string | null
//   }
//   error: string | null
//   message: string
//   status: number
// }

// export type CartItem = {
//   id: string
//   product_id: string
//   quantity: number
//   price: number
//   product: Product
// }

// export type Product = {
//   id: string
//   name: string
//   price: number
//   discount_price: number
//   description: string
//   origin_image: string
// }


export default function CartPage() {
  const { data: cartItemsDataNew, isLoading } = useGetCustomerCurrentCart()
  const cartItems = cartItemsDataNew?.data?.cartItems ?? []

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">
        Giỏ hàng
      </h1>
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Đang tải giỏ hàng...
          </p>
        </div>
      ) : (
        cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Giỏ hàng trống
            </p>
            <Link
              href={`${BASE_PATH}/products`}
              className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <CartPageClient
            cartItems={cartItems}
            basePath={BASE_PATH}
          />
        ))}
    </div>
  )
}