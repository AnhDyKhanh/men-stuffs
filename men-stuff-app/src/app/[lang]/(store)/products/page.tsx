import Link from 'next/link'
import { labels, BASE_PATH } from '@/lib/labels'
import ProductGrid from '@/components/store/ProductGrid'
import { PlaceholderProduct } from '@/app/_constants/placeholderData'

type PageProps = {
  params: Promise<{
    lang: string
  }>
}

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  description?: string
  colors?: string[]
  sizes?: string[]
}

export default async function ProductsPage({ params }: PageProps) {
  await params

  // export interface PlaceholderProduct {
  //   id: string
  //   name: string
  //   price: number
  //   priceFormatted: string
  //   imageUrl: string
  //   href: string
  //   rating?: number
  //   reviewCount?: number
  //   label?: 'new' | 'sale'
  // }
  // Mock products data
  const mockProducts: PlaceholderProduct[] = [
    {
      id: '1',
      name: 'Premium Cotton Shirt',
      price: 499000,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      rating: 5,
      reviewCount: 128,
      priceFormatted: '499000',
      href: '/products/1',
    },
    {
      id: '2',
      name: 'Classic Denim Jeans',
      price: 799000,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
      rating: 4.5,
      reviewCount: 95,
      priceFormatted: '799000',
      href: '/products/2',
    },
    {
      id: '3',
      name: 'Casual T-Shirt',
      price: 299000,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewCount: 156,
      priceFormatted: '299000',
      href: '/products/3',
    },
    {
      id: '4',
      name: 'Formal Blazer',
      price: 1299000,
      imageUrl: 'https://images.unsplash.com/photo-1591047990975-d7f4dad7bc7a?w=400&h=400&fit=crop',
      rating: 4.9,
      reviewCount: 67,
      priceFormatted: '1299000',
      href: '/products/4',
    },
    {
      id: '5',
      name: 'Polo Shirt',
      price: 399000,
      imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60908?w=400&h=400&fit=crop',
      rating: 4.7,
      reviewCount: 89,
      priceFormatted: '399000',
      href: '/products/5',
    },
    {
      id: '6',
      name: 'Cargo Shorts',
      price: 449000,
      imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
      rating: 4.6,
      reviewCount: 73,
      priceFormatted: '449000',
      href: '/products/6',
    },
    {
      id: '7',
      name: 'Hoodie',
      price: 699000,
      imageUrl: 'https://images.unsplash.com/photo-1556821552-5f394c7fbb12?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewCount: 142,
      priceFormatted: '699000',
      href: '/products/7',
    },
    {
      id: '8',
      name: 'Leather Jacket',
      price: 1599000,
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669714153f27?w=400&h=400&fit=crop',
      rating: 5,
      reviewCount: 54,
      priceFormatted: '1599000',
      href: '/products/8',
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          {'Sản Phẩm'}
        </h1>
        <p className="text-gray-600 text-lg">
          {'Khám phá bộ sưu tập quần áo nam phong cách của chúng tôi'}
        </p>
      </div>

      {/* Filter Section (Optional) */}
      <div className="mb-8 flex gap-4 flex-wrap">
        <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
          All
        </button>
        <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">
          Shirts
        </button>
        <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">
          Jeans
        </button>
        <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">
          Jackets
        </button>
        <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">
          Accessories
        </button>
      </div>

      {/* Products Grid */}
      <ProductGrid products={mockProducts} />
    </div>
  )
}