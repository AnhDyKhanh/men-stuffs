import Link from 'next/link'
import { labels, BASE_PATH } from '@/lib/labels'
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

export default async function HomePage({ params }: PageProps) {
  await params
  const heroSlides = getHeroSlides(BASE_PATH)
  const newProducts = getNewProducts('vi', BASE_PATH)
  const featuredCategories = getFeaturedCategories(BASE_PATH, 'vi')
  const bannerRows = getTwoBannerRows(BASE_PATH)

  return (
    <>
      <HeroSlideshow slides={heroSlides} />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-16">
        <section aria-labelledby="new-products-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2
              id="new-products-heading"
              className="text-2xl font-semibold text-neutral-900 md:text-3xl"
            >
              {labels.home.newProducts}
            </h2>
            <Link
              href={`${BASE_PATH}/products`}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
            >
              {labels.home.viewAll}
            </Link>
          </div>
          <ProductGrid
            products={newProducts}
            buyNowLabel={labels.products.addToCart}
            columns={4}
          />
        </section>

        <section>
          <FeaturedCategoriesSection
            title={labels.home.featuredCategories}
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
