import { getDictionary, isValidLocale } from '@/lib/i18n'
import ProductGrid from '../cart/_components/ProductGrid'

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
  const { lang } = await params

  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Premium Cotton Shirt',
      price: 499000,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      category: 'Shirts',
      rating: 5,
      reviews: 128,
      description: 'High-quality cotton shirt perfect for everyday wear',
      colors: ['Black', 'White', 'Blue'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 2,
      name: 'Classic Denim Jeans',
      price: 799000,
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
      category: 'Jeans',
      rating: 4.5,
      reviews: 95,
      description: 'Comfortable and stylish denim jeans',
      colors: ['Navy', 'Black', 'Light Blue'],
      sizes: ['28', '30', '32', '34', '36']
    },
    {
      id: 3,
      name: 'Casual T-Shirt',
      price: 299000,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      category: 'T-Shirts',
      rating: 4.8,
      reviews: 156,
      description: 'Lightweight and breathable t-shirt',
      colors: ['White', 'Black', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 4,
      name: 'Formal Blazer',
      price: 1299000,
      image: 'https://images.unsplash.com/photo-1591047990975-d7f4dad7bc7a?w=400&h=400&fit=crop',
      category: 'Blazers',
      rating: 4.9,
      reviews: 67,
      description: 'Professional blazer for formal occasions',
      colors: ['Black', 'Navy', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 5,
      name: 'Polo Shirt',
      price: 399000,
      image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60908?w=400&h=400&fit=crop',
      category: 'Shirts',
      rating: 4.7,
      reviews: 89,
      description: 'Classic polo shirt with collar',
      colors: ['Red', 'Blue', 'Green', 'White'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 6,
      name: 'Cargo Shorts',
      price: 449000,
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
      category: 'Shorts',
      rating: 4.6,
      reviews: 73,
      description: 'Practical cargo shorts with multiple pockets',
      colors: ['Khaki', 'Black', 'Olive'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 7,
      name: 'Hoodie',
      price: 699000,
      image: 'https://images.unsplash.com/photo-1556821552-5f394c7fbb12?w=400&h=400&fit=crop',
      category: 'Hoodies',
      rating: 4.8,
      reviews: 142,
      description: 'Cozy hoodie perfect for cold weather',
      colors: ['Black', 'Gray', 'Navy', 'White'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 8,
      name: 'Leather Jacket',
      price: 1599000,
      image: 'https://images.unsplash.com/photo-1557804506-669714153f27?w=400&h=400&fit=crop',
      category: 'Jackets',
      rating: 5,
      reviews: 54,
      description: 'Premium leather jacket for style and protection',
      colors: ['Black', 'Brown'],
      sizes: ['S', 'M', 'L', 'XL']
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          {locale === 'vi' ? 'Sản Phẩm' : 'Products'}
        </h1>
        <p className="text-gray-600 text-lg">
          {locale === 'vi'
            ? 'Khám phá bộ sưu tập quần áo nam phong cách của chúng tôi'
            : 'Discover our stylish collection of men\'s clothing'
          }
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
      <ProductGrid products={mockProducts} locale={locale} />
    </div>
  )
}