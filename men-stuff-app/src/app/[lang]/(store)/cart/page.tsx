'use client'

import { labels, BASE_PATH } from '@/lib/labels'
import Link from 'next/link'
import CartPageClient from './_components/CartPageClient'
import { useGetCustomerCurrentCart } from '@/app/_hooks/getCustomerCurrentCart'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  size: string
  color: string
}

export default function CartPage() {
  const { data: cartItemsDataNew } = useGetCustomerCurrentCart()

  const cartItems: CartItem[] =
    cartItemsDataNew?.data?.map((item: any, index: number) => {
      const price =
        item.product.discount_price ?? item.product.price

      return {
        id: index,
        name: item.product.name,
        price: price,
        quantity: item.quantity,
        image: item.product.origin_image,
        size: 'Free size',
        color: 'Default'
      }
    }) ?? []

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">
        {labels.common.cart}
      </h1>

      {cartItems.length === 0 ? (
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
      )}
    </div>
  )
}