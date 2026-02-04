/**
 * Placeholder data for storefront UI (student project)
 * Replace with real API/data later
 */

export interface PlaceholderProduct {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  imageUrl: string;
  href: string;
  rating?: number;
  reviewCount?: number;
  label?: "new" | "sale";
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  href: string;
}

export interface BannerItem {
  id: string;
  title: string;
  imageUrl: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const CURRENCY = "VND";
const LOCALE_VI = "vi-VN";

function formatPrice(value: number): string {
  return new Intl.NumberFormat(LOCALE_VI, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getPlaceholderProducts(locale: string, basePath: string): PlaceholderProduct[] {
  const products: Omit<PlaceholderProduct, "priceFormatted" | "href">[] = [
    { id: "1", name: "Silver Ring Classic", price: 2900000, imageUrl: "", rating: 5, reviewCount: 6, label: undefined },
    { id: "2", name: "Lotus Serene Spoon", price: 2950000, imageUrl: "", rating: 0, reviewCount: 0, label: "new" },
    { id: "3", name: "Sunpact Black Silver", price: 1350000, imageUrl: "", rating: 5, reviewCount: 2, label: "new" },
    { id: "4", name: "Tide Helios Black Silver", price: 1150000, imageUrl: "", rating: 5, reviewCount: 3, label: "new" },
    { id: "5", name: "Suncrest Black Silver", price: 885000, imageUrl: "", rating: 5, reviewCount: 1, label: "new" },
    { id: "6", name: "Ripple Helios Black Silver", price: 845000, imageUrl: "", rating: 5, reviewCount: 1, label: "new" },
    { id: "7", name: "Helios Faliraki Sunglasses", price: 1750000, imageUrl: "", rating: 5, reviewCount: 4 },
    { id: "8", name: "Helios Card Set", price: 555000, imageUrl: "", rating: 5, reviewCount: 3 },
  ];

  return products.map((p) => ({
    ...p,
    priceFormatted: formatPrice(p.price),
    href: `${basePath}/product/${p.id}`,
    imageUrl: p.imageUrl || "https://placehold.co/400x400/f5f5f5/999?text=Product",
  }));
}

export function getHeroSlides(basePath: string): HeroSlide[] {
  return [
    {
      id: "1",
      title: "Unique Handcrafted Jewelry",
      subtitle: "Discover the collection",
      imageUrl: "https://placehold.co/1920x900/1a1a1a/fff?text=Hero+1",
      href: `${basePath}/products`,
    },
    {
      id: "2",
      title: "New Arrivals",
      subtitle: "Shop the latest",
      imageUrl: "https://placehold.co/1920x900/2d2d2d/fff?text=Hero+2",
      href: `${basePath}/products`,
    },
    {
      id: "3",
      title: "Best Sellers",
      subtitle: "Customer favorites",
      imageUrl: "https://placehold.co/1920x900/1a1a1a/fff?text=Hero+3",
      href: `${basePath}/products`,
    },
  ];
}

export function getTwoBannerRows(basePath: string): BannerItem[][] {
  return [
    [
      { id: "1", title: "Silver Ring For Men", imageUrl: "https://placehold.co/800x800/333/fff?text=Ring", href: `${basePath}/products` },
      { id: "2", title: "Angelic Collection", imageUrl: "https://placehold.co/800x800/444/fff?text=Collection", href: `${basePath}/products` },
    ],
    [
      { id: "3", title: "New In", imageUrl: "https://placehold.co/800x800/333/fff?text=New", href: `${basePath}/products` },
      { id: "4", title: "Silver Pendant", imageUrl: "https://placehold.co/800x800/444/fff?text=Pendant", href: `${basePath}/products` },
    ],
    [
      { id: "5", title: "Silver Bracelet", imageUrl: "https://placehold.co/800x800/333/fff?text=Bracelet", href: `${basePath}/products` },
      { id: "6", title: "Silver Earrings", imageUrl: "https://placehold.co/800x800/444/fff?text=Earrings", href: `${basePath}/products` },
    ],
  ];
}

export function getAnnouncementMessages(): string[] {
  return [
    "Free shipping nationwide",
    "1-for-1 exchange within 3 days",
    "Lifetime warranty on selected items",
  ];
}

export function getFooterColumns(basePath: string): FooterColumn[] {
  return [
    {
      title: "Connect with us",
      links: [
        { label: "Facebook", href: "#" },
        { label: "Instagram", href: "#" },
      ],
    },
    {
      title: "Customer care",
      links: [
        { label: "Payment", href: `${basePath}/pages/policies/delivery` },
        { label: "Delivery", href: `${basePath}/pages/policies/delivery` },
        { label: "Return policy", href: `${basePath}/pages/policies/delivery` },
        { label: "Contact", href: `${basePath}/pages/contact` },
      ],
    },
    {
      title: "About us",
      links: [
        { label: "Our story", href: `${basePath}/pages/about` },
        { label: "Store locations", href: `${basePath}/pages/contact` },
      ],
    },
    {
      title: "For customers",
      links: [
        { label: "Blog", href: "#" },
        { label: "Size guide", href: "#" },
      ],
    },
  ];
}

export function getMainNavLinks(basePath: string): NavLink[] {
  return [
    { label: "Shop all", href: `${basePath}/products` },
    { label: "New in", href: `${basePath}/products` },
    { label: "Feedback", href: `${basePath}/pages/contact` },
    { label: "Collections", href: `${basePath}/products` },
  ];
}
