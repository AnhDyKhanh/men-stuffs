'use client'

import Link from 'next/link'
import { BASE_PATH } from '@/lib/labels'
import ProductGrid from '@/components/store/ProductGrid'
import { useGetAllProducts } from '@/app/_hooks/getAllProductsMutation'
import type { Product } from '@/app/_models/product'
import type { PlaceholderProduct } from '@/app/_constants/placeholderData'

const NEW_IN_SIZE = 30
const CURRENCY = 'VND'
const LOCALE_VI = 'vi-VN'

function formatPrice(value: number): string {
  return new Intl.NumberFormat(LOCALE_VI, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value)
}

function mapProductsToPlaceholder(
  products: Product[] | null | undefined,
  basePath: string
): PlaceholderProduct[] {
  if (!products) return []
  return products.map((p) => ({
    id: p.id,
    name: p.name ?? 'Sản phẩm',
    price: p.price ?? 0,
    priceFormatted: formatPrice(p.price ?? 0),
    imageUrl:
      p.origin_image ||
      'https://placehold.co/400x400/f5f5f5/999?text=Product',
    href: `${basePath}/product/${p.id}`,
    rating: 0,
    reviewCount: 0,
    label: 'new',
  }))
}

export default function NewInClient() {
  const { data: response, isLoading, isError } = useGetAllProducts({
    page: 1,
    size: NEW_IN_SIZE,
    orderBy: 'created_at',
    ascending: false,
  })

  const products = mapProductsToPlaceholder(
    (response as { data?: Product[] })?.data ?? null,
    BASE_PATH
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">
          New In
        </h1>
        <p className="text-neutral-400">
          Top {NEW_IN_SIZE} sản phẩm mới nhất — cập nhật liên tục.
        </p>
      </div>

      {isError && (
        <p className="mb-4 text-sm text-red-400">
          Không thể tải sản phẩm. Vui lòng thử lại.
        </p>
      )}

      {isLoading && products.length === 0 ? (
        <p className="text-neutral-400 py-12">Đang tải...</p>
      ) : products.length === 0 ? (
        <p className="text-neutral-400 py-12">Chưa có sản phẩm nào.</p>
      ) : (
        <>
          <p className="text-sm text-neutral-500 mb-4">
            {products.length} sản phẩm mới
          </p>
          <ProductGrid
            products={products}
            buyNowLabel="Thêm vào giỏ"
            columns={4}
          />
          <div className="mt-8 text-center">
            <Link
              href={`${BASE_PATH}/products`}
              className="inline-block px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
