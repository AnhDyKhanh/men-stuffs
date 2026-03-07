'use client'

import Link from 'next/link'
import { labels, BASE_PATH } from '@/lib/labels'
import {
  getHeroSlides,
  getNewProducts as getPlaceholderNewProducts,
  getTwoBannerRows,
  type PlaceholderProduct,
} from '@/app/_constants/placeholderData'
import HeroSlideshow from '@/components/store/HeroSlideshow'
import ProductGrid from '@/components/store/ProductGrid'
import TwoBannerSection from '@/components/store/TwoBannerSection'
import { useGetAllProducts } from '@/app/_hooks/getAllProductsMutation'
import type { Product } from '@/app/_models/product'

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
  basePath: string,
): PlaceholderProduct[] {
  if (!products) return []

  return products.map((p) => {
    const price = p.price ?? 0

    return {
      id: p.id,
      name: p.name ?? 'Sản phẩm',
      price,
      priceFormatted: formatPrice(price),
      imageUrl:
        p.origin_image ||
        'https://placehold.co/400x400/f5f5f5/999?text=Product',
      href: `${basePath}/products/${p.slug || p.id}`,
      rating: 0,
      reviewCount: 0,
      label: 'new',
    }
  })
}

export default function StoreHomeClient() {
  const heroSlides = getHeroSlides(BASE_PATH)

  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useGetAllProducts({
    page: 0,
    size: 8,
    orderBy: 'created_at',
    ascending: false,
  })

  const apiProducts = (productsResponse?.data ?? null) as Product[] | null
  const newProductsFromApi = mapProductsToPlaceholder(apiProducts, BASE_PATH)
  const newProducts: PlaceholderProduct[] =
    newProductsFromApi.length > 0
      ? newProductsFromApi
      : getPlaceholderNewProducts('vi', BASE_PATH)

  const latestProductForBanner =
    newProductsFromApi.length > 0
      ? {
        title: newProductsFromApi[0].name,
        href: newProductsFromApi[0].href,
        imageUrl: newProductsFromApi[0].imageUrl,
      }
      : undefined

  const bannerRows = getTwoBannerRows(BASE_PATH, latestProductForBanner)

  return (
    <>
      <HeroSlideshow slides={heroSlides} />

      <div className="bg-black max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-16">
        <section aria-labelledby="new-products-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2
              id="new-products-heading"
              className="text-2xl font-semibold text-white md:text-3xl"
            >
              {labels.home.newProducts}
            </h2>
            <Link
              href={`${BASE_PATH}/products`}
              className="text-sm font-medium text-neutral-300 hover:text-white underline underline-offset-2"
            >
              {labels.home.viewAll}
            </Link>
          </div>

          {isProductsError && (
            <p className="mb-4 text-sm text-red-400">
              Không thể tải sản phẩm. Đang hiển thị dữ liệu mẫu.
            </p>
          )}

          {isLoadingProducts && newProductsFromApi.length === 0 ? (
            <p className="text-sm text-neutral-400">Đang tải sản phẩm...</p>
          ) : (
            <ProductGrid
              products={newProducts}
              buyNowLabel={labels.products.addToCart}
              columns={4}
              variant="dark"
            />
          )}
        </section>

        <section aria-labelledby="featured-categories-heading">
          <h2
            id="featured-categories-heading"
            className="text-2xl font-semibold text-white mb-8 md:text-3xl"
          >
            Danh mục nổi bật
          </h2>
        </section>
      </div>

      {bannerRows.map((row, index) => (
        <TwoBannerSection key={index} items={row} />
      ))}
    </>
  )
}

