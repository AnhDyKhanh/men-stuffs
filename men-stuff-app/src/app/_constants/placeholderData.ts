/**
 * Placeholder data for storefront UI (student project)
 * Replace with real API/data later
 */

export interface PlaceholderProduct {
  id: string
  name: string
  price: number
  priceFormatted: string
  imageUrl: string
  href: string
  rating?: number
  reviewCount?: number
  label?: 'new' | 'sale'
}

export interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  href: string
}

export interface BannerItem {
  id: string
  title: string
  imageUrl: string
  href: string
}

export interface NavLink {
  key: string
  label: string
  href: string
}

export interface FooterLink {
  key: string
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

const CURRENCY = 'VND'
const LOCALE_VI = 'vi-VN'

function formatPrice(value: number): string {
  return new Intl.NumberFormat(LOCALE_VI, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value)
}

export function getPlaceholderProducts(
  locale: string,
  basePath: string,
): PlaceholderProduct[] {
  const products: Omit<PlaceholderProduct, 'priceFormatted' | 'href'>[] = [
    {
      id: '1',
      name: 'Silver Ring Classic',
      price: 2900000,
      imageUrl: '',
      rating: 5,
      reviewCount: 6,
      label: undefined,
    },
    {
      id: '2',
      name: 'Lotus Serene Spoon',
      price: 2950000,
      imageUrl: '',
      rating: 0,
      reviewCount: 0,
      label: 'new',
    },
    {
      id: '3',
      name: 'Sunpact Black Silver',
      price: 1350000,
      imageUrl: '',
      rating: 5,
      reviewCount: 2,
      label: 'new',
    },
    {
      id: '4',
      name: 'Tide Helios Black Silver',
      price: 1150000,
      imageUrl: '',
      rating: 5,
      reviewCount: 3,
      label: 'new',
    },
    {
      id: '5',
      name: 'Suncrest Black Silver',
      price: 885000,
      imageUrl: '',
      rating: 5,
      reviewCount: 1,
      label: 'new',
    },
    {
      id: '6',
      name: 'Ripple Helios Black Silver',
      price: 845000,
      imageUrl: '',
      rating: 5,
      reviewCount: 1,
      label: 'new',
    },
    {
      id: '7',
      name: 'Helios Faliraki Sunglasses',
      price: 1750000,
      imageUrl: '',
      rating: 5,
      reviewCount: 4,
    },
    {
      id: '8',
      name: 'Helios Card Set',
      price: 555000,
      imageUrl: '',
      rating: 5,
      reviewCount: 3,
    },
  ]

  return products.map((p) => ({
    ...p,
    priceFormatted: formatPrice(p.price),
    href: `${basePath}/product/${p.id}`,
    imageUrl:
      p.imageUrl || 'https://placehold.co/400x400/f5f5f5/999?text=Product',
  }))
}

/** New arrivals (products with label "new" or first N products). */
export function getNewProducts(
  locale: string,
  basePath: string,
  limit = 8,
): PlaceholderProduct[] {
  const all = getPlaceholderProducts(locale, basePath)
  const withNew = all.filter((p) => p.label === 'new')
  return (withNew.length >= limit ? withNew : all).slice(0, limit)
}

export interface FeaturedCategory {
  id: string
  title: string
  imageUrl: string
  href: string
}

const FEATURED_CATEGORIES_META: { id: string; titleVi: string; titleEn: string; imageUrl: string }[] = [
  { id: 'rings', titleVi: 'Nhẫn', titleEn: 'Rings', imageUrl: '/categories/rings.png' },
  { id: 'bracelets', titleVi: 'Vòng tay', titleEn: 'Bracelets', imageUrl: '/categories/bracelets.png' },
  { id: 'pendants', titleVi: 'Mặt dây', titleEn: 'Pendants', imageUrl: '/categories/pendants.png' },
  { id: 'accessories', titleVi: 'Phụ kiện', titleEn: 'Accessories', imageUrl: '/categories/accessories.png' },
]

/** Featured categories for home page. */
export function getFeaturedCategories(basePath: string, locale?: string): FeaturedCategory[] {
  const isVi = locale !== 'en'
  return FEATURED_CATEGORIES_META.map((c) => ({
    id: c.id,
    title: isVi ? c.titleVi : c.titleEn,
    imageUrl: c.imageUrl,
    href: `${basePath}/products`,
  }))
}

export function getHeroSlides(basePath: string): HeroSlide[] {
  return [
    {
      id: '1',
      title: 'Unique Handcrafted Jewelry',
      subtitle: 'Discover the collection',
      imageUrl: '/hero/slide-1.png',
      href: `${basePath}/products`,
    },
    {
      id: '2',
      title: 'New Arrivals',
      subtitle: 'Shop the latest',
      imageUrl: '/hero/slide-2.png',
      href: `${basePath}/products`,
    },
    {
      id: '3',
      title: 'Best Sellers',
      subtitle: 'Customer favorites',
      imageUrl: '/hero/slide-3.png',
      href: `${basePath}/products`,
    },
  ]
}

/**
 * Category/product banner grid on home page.
 *
 * If latestProduct is provided, \"New In\" banner will use:
 * - latestProduct.title as title (fallback \"New In\")
 * - latestProduct.href as link to product detail
 * - latestProduct.imageUrl if available, otherwise static image
 */
export function getTwoBannerRows(
  basePath: string,
  latestProduct?: { title?: string | null; href?: string; imageUrl?: string | null },
): BannerItem[][] {
  const newInTitle = latestProduct?.title || 'New In'
  const newInHref = latestProduct?.href || `${basePath}/products`
  const newInImage = latestProduct?.imageUrl || '/banners/new-in.jpg'

  return [
    [
      {
        id: '1',
        title: 'Silver Ring For Men',
        imageUrl: '/banners/rings.jpg',
        href: `${basePath}/products`,
      },
      {
        id: '2',
        title: 'Angelic Collection',
        imageUrl: '/banners/collection.jpg',
        href: `${basePath}/products`,
      },
    ],
    [
      {
        id: '3',
        title: newInTitle,
        imageUrl: newInImage,
        href: newInHref,
      },
      {
        id: '4',
        title: 'Silver Pendant',
        imageUrl: '/banners/new-in.jpg',
        href: `${basePath}/products`,
      },
    ],
    [
      {
        id: '5',
        title: 'Silver Bracelet',
        imageUrl: '/banners/bracelet.jpg',
        href: `${basePath}/products`,
      },
      {
        id: '6',
        title: 'Silver Earrings',
        imageUrl: '/banners/earring.jpg',
        href: `${basePath}/products`,
      },
    ],
  ]
}

export function getAnnouncementMessages(): string[] {
  return [
    'Free shipping nationwide',
    '1-for-1 exchange within 3 days',
    'Lifetime warranty on selected items',
  ]
}

export function getFooterColumns(basePath: string): FooterColumn[] {
  return [
    {
      title: 'Connect with us',
      links: [
        { key: 'footer-connect-facebook', label: 'Facebook', href: '#' },
        { key: 'footer-connect-instagram', label: 'Instagram', href: '#' },
      ],
    },
    {
      title: 'Customer care',
      links: [
        { key: 'footer-care-payment', label: 'Payment', href: `${basePath}/pages/policies/delivery` },
        { key: 'footer-care-delivery', label: 'Delivery', href: `${basePath}/pages/policies/delivery` },
        { key: 'footer-care-return', label: 'Return policy', href: `${basePath}/pages/policies/delivery` },
        { key: 'footer-care-contact', label: 'Contact', href: `${basePath}/pages/contact` },
      ],
    },
    {
      title: 'About us',
      links: [
        { key: 'footer-about-story', label: 'Our story', href: `${basePath}/pages/about` },
        { key: 'footer-about-stores', label: 'Store locations', href: `${basePath}/pages/contact` },
      ],
    },
    {
      title: 'For customers',
      links: [
        { key: 'footer-customers-blog', label: 'Blog', href: '#' },
        { key: 'footer-customers-size-guide', label: 'Size guide', href: '#' },
      ],
    },
  ]
}

export function getMainNavLinks(basePath: string): NavLink[] {
  return [
    { key: 'nav-shop-all', label: 'Shop all', href: `${basePath}/products` },
    { key: 'nav-new-in', label: 'New in', href: `${basePath}/products` },
    { key: 'nav-feedback', label: 'Feedback', href: `${basePath}/pages/contact` },
    { key: 'nav-collections', label: 'Collections', href: `${basePath}/products` },
  ]
}
