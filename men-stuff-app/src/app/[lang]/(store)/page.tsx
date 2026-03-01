import Link from 'next/link'
import { getDictionary, isValidLocale } from '@/lib/i18n'
import {
  getHeroSlides,
  getNewProducts,
  getFeaturedCategories,
  getTwoBannerRows,
} from '@/app/_constants/placeholderData'
import HeroSlideshow from '@/components/store/HeroSlideshow'
import ProductGrid from '@/components/store/ProductGrid'
import TwoBannerSection from '@/components/store/TwoBannerSection'
import FeaturedCategoriesSection from '@/components/store/FeaturedCategoriesSection'

type PageProps = {
  params: Promise<{ lang: string }>
}

/**
 * Home page - Banner, New products, Featured categories
 * Tham khảo cấu trúc [lang]/(admin)/dashboard
 */
export default async function HomePage({ params }: PageProps) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)

  const basePath = `/${locale}`
  const heroSlides = getHeroSlides(basePath)
  const newProducts = getNewProducts(locale, basePath)
  const featuredCategories = getFeaturedCategories(basePath, locale)
  const bannerRows = getTwoBannerRows(basePath)

  return (
    <>
      {/* Banner */}
      <HeroSlideshow slides={heroSlides} />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-16">
        {/* Sản phẩm mới */}
        <section aria-labelledby="new-products-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2
              id="new-products-heading"
              className="text-2xl font-semibold text-neutral-900 md:text-3xl"
            >
              {dict.home.newProducts}
            </h2>
            <Link
              href={`${basePath}/products`}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
            >
              {dict.home.viewAll}
            </Link>
          </div>
          <ProductGrid
            products={newProducts}
            buyNowLabel={dict.products.addToCart}
            columns={4}
          />
        </section>

        {/* Danh mục nổi bật */}
        <section>
          <FeaturedCategoriesSection
            title={dict.home.featuredCategories}
            categories={featuredCategories}
          />
        </section>
      </div>

      {bannerRows.map((row, index) => (
        <TwoBannerSection key={index} items={row} />
      ))}
    </>
  )
}
