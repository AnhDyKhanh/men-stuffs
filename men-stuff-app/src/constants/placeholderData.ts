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
  label?: 'new' | 'sale' | 'hot'
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

export function getPlaceholderProducts(locale: string, basePath: string): PlaceholderProduct[] {
  const products: Omit<PlaceholderProduct, 'priceFormatted' | 'href'>[] = [
    {
      id: '1',
      name: 'Nhẫn bạc cổ điển',
      price: 2900000,
      imageUrl: '',
      rating: 5,
      reviewCount: 6,
      label: undefined,
    },
    {
      id: '2',
      name: 'Muỗng trang trí hoa sen',
      price: 2950000,
      imageUrl: '',
      rating: 0,
      reviewCount: 0,
      label: 'new',
    },
    {
      id: '3',
      name: 'Nhẫn bạc đen Sunpact',
      price: 1350000,
      imageUrl: '',
      rating: 5,
      reviewCount: 2,
      label: 'new',
    },
    {
      id: '4',
      name: 'Nhẫn Tide Helios đen bạc',
      price: 1150000,
      imageUrl: '',
      rating: 5,
      reviewCount: 3,
      label: 'new',
    },
    {
      id: '5',
      name: 'Nhẫn Suncrest đen bạc',
      price: 885000,
      imageUrl: '',
      rating: 5,
      reviewCount: 1,
      label: 'new',
    },
    {
      id: '6',
      name: 'Nhẫn Ripple Helios đen bạc',
      price: 845000,
      imageUrl: '',
      rating: 5,
      reviewCount: 1,
      label: 'new',
    },
    {
      id: '7',
      name: 'Kính mát Helios Faliraki',
      price: 1750000,
      imageUrl: '',
      rating: 5,
      reviewCount: 4,
    },
    {
      id: '8',
      name: 'Bộ bài Helios',
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
    imageUrl: p.imageUrl || 'https://placehold.co/400x400/f5f5f5/999?text=S%E1%BA%A3n+ph%E1%BA%A9m',
  }))
}

/** New arrivals (products with label "new" or first N products). */
export function getNewProducts(locale: string, basePath: string, limit = 8): PlaceholderProduct[] {
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

const FEATURED_CATEGORIES_META: { id: string; title: string; imageUrl: string }[] = [
  { id: 'rings', title: 'Nhẫn', imageUrl: '/categories/rings.png' },
  { id: 'bracelets', title: 'Vòng tay', imageUrl: '/categories/bracelets.png' },
  { id: 'pendants', title: 'Mặt dây', imageUrl: '/categories/pendants.png' },
  { id: 'accessories', title: 'Phụ kiện', imageUrl: '/categories/accessories.png' },
]

/** Featured categories for home page. */
export function getFeaturedCategories(basePath: string): FeaturedCategory[] {
  return FEATURED_CATEGORIES_META.map((c) => ({
    id: c.id,
    title: c.title,
    imageUrl: c.imageUrl,
    href: `${basePath}/products`,
  }))
}

export function getHeroSlides(basePath: string): HeroSlide[] {
  return [
    {
      id: '1',
      title: 'Trang sức thủ công độc bản',
      subtitle: 'Khám phá bộ sưu tập',
      imageUrl: '/hero/slide-1.png',
      href: `${basePath}/products`,
    },
    {
      id: '2',
      title: 'Hàng mới về',
      subtitle: 'Mua sắm những sản phẩm mới nhất',
      imageUrl: '/hero/slide-2.png',
      href: `${basePath}/products`,
    },
    {
      id: '3',
      title: 'Bán chạy nhất',
      subtitle: 'Được khách hàng yêu thích',
      imageUrl: '/hero/slide-3.png',
      href: `${basePath}/products`,
    },
  ]
}

/**
 * Category/product banner grid on home page.
 *
 * If latestProduct is provided, the new-arrivals banner will use:
 * - latestProduct.title as title (fallback \"Hàng mới về\")
 * - latestProduct.href as link to product detail
 * - latestProduct.imageUrl if available, otherwise static image
 */
export function getTwoBannerRows(
  basePath: string,
  latestProduct?: { title?: string | null; href?: string; imageUrl?: string | null },
): BannerItem[][] {
  const newInTitle = latestProduct?.title || 'Hàng mới về'
  const newInHref = latestProduct?.href || `${basePath}/products`
  const newInImage = latestProduct?.imageUrl || '/banners/new-in.jpg'

  return [
    [
      {
        id: '1',
        title: 'Nhẫn bạc nam',
        imageUrl: '/banners/rings.jpg',
        href: `${basePath}/products`,
      },
      {
        id: '2',
        title: 'Bộ sưu tập Thiên thần',
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
        title: 'Mặt dây bạc',
        imageUrl: '/banners/new-in.jpg',
        href: `${basePath}/products`,
      },
    ],
    [
      {
        id: '5',
        title: 'Vòng tay bạc',
        imageUrl: '/banners/bracelet.jpg',
        href: `${basePath}/products`,
      },
      {
        id: '6',
        title: 'Hoa tai bạc',
        imageUrl: '/banners/earring.jpg',
        href: `${basePath}/products`,
      },
    ],
  ]
}

export function getAnnouncementMessages(): string[] {
  return [
    'Miễn phí vận chuyển toàn quốc',
    'Đổi 1 đổi 1 trong 3 ngày',
    'Bảo hành trọn đời cho sản phẩm được chọn',
  ]
}

export function getFooterColumns(basePath: string): FooterColumn[] {
  return [
    {
      title: 'Kết nối với chúng tôi',
      links: [
        { key: 'footer-connect-facebook', label: 'Facebook', href: '#' },
        { key: 'footer-connect-instagram', label: 'Instagram', href: '#' },
      ],
    },
    {
      title: 'Chăm sóc khách hàng',
      links: [
        { key: 'footer-care-payment', label: 'Thanh toán', href: `${basePath}/pages/policies/delivery` },
        { key: 'footer-care-delivery', label: 'Giao hàng', href: `${basePath}/pages/policies/delivery` },
        { key: 'footer-care-return', label: 'Chính sách đổi trả', href: `${basePath}/pages/policies/delivery` },
        { key: 'footer-care-contact', label: 'Liên hệ', href: `${basePath}/pages/contact` },
      ],
    },
    {
      title: 'Về chúng tôi',
      links: [
        { key: 'footer-about-story', label: 'Câu chuyện thương hiệu', href: `${basePath}/pages/about` },
        { key: 'footer-about-stores', label: 'Hệ thống cửa hàng', href: `${basePath}/pages/contact` },
      ],
    },
    {
      title: 'Dành cho khách hàng',
      links: [
        { key: 'footer-customers-blog', label: 'Bài viết', href: '#' },
        { key: 'footer-customers-size-guide', label: 'Hướng dẫn chọn cỡ', href: '#' },
      ],
    },
  ]
}

export function getMainNavLinks(basePath: string): NavLink[] {
  return [
    { key: 'nav-shop-all', label: 'Mua sắm tất cả', href: `${basePath}/products` },
    { key: 'nav-new-in', label: 'Sản phẩm mới', href: `${basePath}/new-in` },
    { key: 'nav-feedback', label: 'Phản hồi', href: `${basePath}/pages/contact` },
    { key: 'nav-collections', label: 'Bộ sưu tập', href: `${basePath}/collections` },
  ]
}
