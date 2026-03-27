'use client'

import FeaturedCategoriesSection from '@/app/(store)/_components/FeaturedCategoriesSection'
import HeroSlideshow from '@/app/(store)/_components/HeroSlideshow'
import ProductGrid from '@/app/(store)/_components/ProductGrid'
import TwoBannerSection from '@/app/(store)/_components/TwoBannerSection'
import {
  getHeroSlides,
  getNewProducts as getPlaceholderNewProducts,
  getTwoBannerRows,
  type PlaceholderProduct
} from '@/constants/placeholderData'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import { useGetAllCategories } from '@/hooks/useGetAllCategories'
import { BASE_PATH, labels } from '@/lib/labels'
import type { Product } from '@/models/product'
import Link from 'next/link'
import { mapCategoriesToFeatured, mapProductsToPlaceholder } from '../_utils/home-page.utils'

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
    status: 'active'
  })

  const apiProducts = (productsResponse?.data ?? null) as Product[] | null
  const newProductsFromApi = mapProductsToPlaceholder(apiProducts, BASE_PATH)
  const newProducts: PlaceholderProduct[] =
    newProductsFromApi.length > 0 ? newProductsFromApi : getPlaceholderNewProducts('vi', BASE_PATH)

  const latestProductForBanner =
    newProductsFromApi.length > 0
      ? {
        title: newProductsFromApi[0].name,
        href: newProductsFromApi[0].href,
        imageUrl: newProductsFromApi[0].imageUrl,
      }
      : undefined

  const bannerRows = getTwoBannerRows(BASE_PATH, latestProductForBanner)

  const { data: categoriesData, isLoading: isLoadingCategories, isError: isCategoriesError } = useGetAllCategories()

  const featuredCategories = mapCategoriesToFeatured(
    categoriesData as { id: string; name?: string; slug?: string }[] | null,
    BASE_PATH,
    4,
  )

  return (
    <>
      <HeroSlideshow slides={heroSlides} />

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 md:py-16">
        <section aria-labelledby="new-products-heading">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="new-products-heading" className="text-2xl font-semibold text-white md:text-3xl">
              {labels.home.newProducts}
            </h2>
            <Link
              href={`${BASE_PATH}/products`}
              className="font-mono text-xs tracking-widest text-white/70 uppercase transition hover:text-white"
            >
              {labels.home.viewAll}
            </Link>
          </div>

          {isProductsError && (
            <p className="mb-4 text-sm text-red-400">Không thể tải sản phẩm. Đang hiển thị dữ liệu mẫu.</p>
          )}

          {isLoadingProducts && newProductsFromApi.length === 0 ? (
            <p className="text-sm text-neutral-400">Đang tải sản phẩm...</p>
          ) : (
            <ProductGrid products={newProducts} buyNowLabel={labels.products.addToCart} columns={4} variant="dark" />
          )}
        </section>

        <section aria-labelledby="featured-categories-heading">
          {isCategoriesError && (
            <p className="mb-4 text-sm text-red-500">Không thể tải danh mục. Đang hiển thị dữ liệu mẫu.</p>
          )}
          {isLoadingCategories && !categoriesData && (
            <p className="text-sm text-neutral-600">Đang tải danh mục sản phẩm...</p>
          )}
          <FeaturedCategoriesSection title="Danh mục nổi bật" categories={featuredCategories} />
        </section>
      </div>

      {bannerRows.map((row, index) => (
        <TwoBannerSection key={index} items={row} />
      ))}
    </>
  )
}
