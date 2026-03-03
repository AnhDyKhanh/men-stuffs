import { labels, BASE_PATH } from '@/lib/labels'
import Link from 'next/link'
import CartPageClient from './_components/CartPageClient'

type PageProps = {
  params: Promise<{ lang: string }>
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  size: string
  color: string
}

export default async function CartPage({ params }: PageProps) {
  await params

  const mockCartItems: CartItem[] = [
    {
      id: 1,
      name: 'Premium Cotton Shirt',
      price: 50,
      quantity: 1,
      image: '',
      size: 'M',
      color: 'Black'
    },
    {
      id: 2,
      name: 'Classic Denim Jeans',
      price: 799000,
      quantity: 2,
      image: '',
      size: 'L',
      color: 'Navy'
    },
    {
      id: 3,
      name: 'Casual T-Shirt',
      price: 299000,
      quantity: 1,
      image: '',
      size: 'S',
      color: 'White'
    }
  ]

  const cartItems: CartItem[] = mockCartItems

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{labels.common.cart}</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Giỏ hàng trống</p>
          <Link
            href={`${BASE_PATH}/products`}
            className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <CartPageClient cartItems={cartItems} basePath={BASE_PATH} />
      )}
    </div>
  )
}
