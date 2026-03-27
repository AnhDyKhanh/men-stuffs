import {
  FeaturedCategory,
  getFeaturedCategories as getPlaceholderFeaturedCategories,
  type PlaceholderProduct
} from '@/constants/placeholderData'
import { Product } from "@/models"

export function formatPrice(value: number): string {
  const LOCALE_VI = 'vi-VN'
  const CURRENCY = 'VND'
  return new Intl.NumberFormat(LOCALE_VI, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value)
}

export function mapProductsToPlaceholder(products: Product[] | null | undefined, basePath: string): PlaceholderProduct[] {
  if (!products) return []

  return products.map((p) => {
    const price = p.price ?? 0

    return {
      id: p.id,
      name: p.name ?? 'Sản phẩm',
      price,
      priceFormatted: formatPrice(price),
      imageUrl: p.origin_image || '/products/no-image.webp',
      href: `${basePath}/product/${p.id}`,
      rating: 0,
      reviewCount: 0,
      label: 'new',
    }
  })
}

export function mapCategoriesToFeatured(
  categories: { id: string; name?: string; slug?: string }[] | null | undefined,
  basePath: string,
  limit = 4,
): FeaturedCategory[] {
  if (!categories || categories.length === 0) {
    return getPlaceholderFeaturedCategories(basePath)
  }

  const placeholderCats = getPlaceholderFeaturedCategories(basePath)

  return categories.slice(0, limit).map(
    (cat, index): FeaturedCategory => ({
      id: cat.id,
      title: cat.name || `Danh mục ${index + 1}`,
      imageUrl: (() => {
        const key = cat.slug || cat.id
        const matched = placeholderCats.find((p) => p.id === key || p.id === cat.id)
        return matched?.imageUrl ?? placeholderCats[0]?.imageUrl ?? '/categories/rings.png'
      })(),
      href: `${basePath}/products?categoryId=${encodeURIComponent(cat.slug || cat.id)}`,
    }),
  )
}