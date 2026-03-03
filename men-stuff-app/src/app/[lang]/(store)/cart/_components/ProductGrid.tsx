'use client'

import ProductCard from './ProductCard'

interface Product {
    id: number
    name: string
    price: number
    image: string
    category: string
    rating: number
    reviews: number
}

interface ProductGridProps {
    products: Product[]
    locale: string
}

export default function ProductGrid({ products, locale }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                />
            ))}
        </div>
    )
}