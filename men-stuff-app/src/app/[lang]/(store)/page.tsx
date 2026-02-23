import { getDictionary, isValidLocale } from '@/lib/i18n'
import {
  getPlaceholderProducts,
  getHeroSlides,
  getTwoBannerRows,
} from '@/app/_constants/placeholderData'
import HeroSlideshow from '@/components/store/HeroSlideshow'
import ProductGrid from '@/components/store/ProductGrid'
import TwoBannerSection from '@/components/store/TwoBannerSection'

type PageProps = {
  params: Promise<{ lang: string }>
}

/**
 * Home page - storefront inspired by reference layout
 * Sections: hero slideshow, featured products, two-banner blocks
 */
export default async function HomePage({ params }: PageProps) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)

  const basePath = `/${locale}`
  const heroSlides = getHeroSlides(basePath)
  const products = getPlaceholderProducts(locale, basePath)
  const bannerRows = getTwoBannerRows(basePath)

  return (
    <>
      <HeroSlideshow slides={heroSlides} />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <section className="mb-16" aria-labelledby="featured-heading">
          <h2
            id="featured-heading"
            className="text-2xl font-semibold text-neutral-900 mb-8 md:text-3xl"
          >
            {dict.products.allProducts}
          </h2>
          <ProductGrid
            products={products}
            buyNowLabel={dict.products.addToCart}
            columns={4}
          />
        </section>
      </div>

      {bannerRows.map((row, index) => (
        <TwoBannerSection key={index} items={row} />
      ))}
    </>
  )
}
