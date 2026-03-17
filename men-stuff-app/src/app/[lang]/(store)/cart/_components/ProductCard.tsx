'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
}

interface ProductCardProps {
  product: Product
  locale: string
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  return (
    <Link href={`/${locale}/products/${product.id}`}>
      <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow transition duration-300 hover:shadow-lg">
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-200">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-300 hover:scale-110"
          />
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Category */}
          <p className="mb-2 text-xs tracking-wider text-black uppercase">{product.category}</p>

          {/* Name */}
          <h3 className="mb-2 truncate text-lg font-semibold text-black">{product.name}</h3>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? '★' : '☆'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-black">({product.reviews})</span>
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-black">{product.price.toLocaleString('en-US')} đ</p>

          {/* Button */}
          <button className="mt-4 w-full rounded bg-black py-2 font-medium text-white transition hover:bg-gray-800">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
