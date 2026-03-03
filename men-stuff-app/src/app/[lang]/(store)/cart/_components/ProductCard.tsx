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
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer">
                {/* Image */}
                <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-110 transition duration-300"
                    />
                </div>

                {/* Info */}
                <div className="p-4">
                    {/* Category */}
                    <p className="text-xs text-black uppercase tracking-wider mb-2">
                        {product.category}
                    </p>

                    {/* Name */}
                    <h3 className="text-lg font-semibold text-black mb-2 truncate">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
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
                    <p className="text-2xl font-bold text-black">
                        {product.price.toLocaleString('en-US')} đ
                    </p>

                    {/* Button */}
                    <button className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 transition font-medium">
                        View Details
                    </button>
                </div>
            </div>
        </Link>
    )
}