import { getDictionary, isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import CartPageClient from './_components/CartPageClient'

type PageProps = {
  params: Promise<{
    lang: string
  }>
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

/**
 * Shopping cart page - Server Component
 */
export default async function CartPage({ params }: PageProps) {
  const { lang } = await params

  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)

  // Mock cart items
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

  const cartItems: CartItem[] = mockCartItems // Change to [] to show empty state

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{dict.common.cart}</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            href={`/${locale}/products`}
            className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <CartPageClient
          cartItems={cartItems}
          locale={locale}
          dict={dict}
        />
      )}
    </div>
  )
}