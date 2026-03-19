import Link from 'next/link'
import type { PlaceholderProduct } from '@/constants/placeholderData'
import Image from 'next/image'

interface ProductCardProps {
  product: PlaceholderProduct
  buyNowLabel?: string
  variant?: 'default' | 'dark'
}

const STAR_COUNT = 5

function StarRating({
  rating = 0,
  reviewCount,
  isDark = false,
}: {
  rating?: number
  reviewCount?: number
  isDark?: boolean
}) {
  const value = Math.min(STAR_COUNT, Math.max(0, rating))
  return (
    <div className="mt-1 flex items-center gap-1" role="img" aria-label={`${value} out of ${STAR_COUNT} stars`}>
      {Array.from({ length: STAR_COUNT }, (_, i) => (
        <span key={i} className={`text-amber-500 ${i < value ? 'opacity-100' : 'opacity-30'}`} aria-hidden>
          ★
        </span>
      ))}
      <span className={`ml-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} aria-hidden>
        {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
      </span>
    </div>
  )
}

export default function ProductCard({ product, buyNowLabel = 'Buy now', variant = 'default' }: ProductCardProps) {
  const isDark = variant === 'dark'
  return (
    <article className="group">
      <div
        className={`relative aspect-square overflow-hidden rounded-2xl border transition-all duration-300 ${isDark
          ? 'border-white/10 bg-[#0F1115]/70 hover:-translate-y-1 hover:border-[#F7931A]/50 hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.2)]'
          : 'border-black/10 bg-white hover:-translate-y-1 hover:shadow-lg'
          }`}
      >
        <Link href={product.href} className="block aspect-square" aria-label={product.name}>
          <Image
            src={product.imageUrl}
            alt=""
            width={400}
            height={400}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:contrast-125"
            unoptimized
          />
        </Link>
        {product.label && (
          <span
            className={`absolute top-3 left-3 rounded-full border px-3 py-1 font-mono text-[10px] font-medium tracking-widest uppercase ${isDark ? 'border-white/15 bg-black/40 text-white' : 'border-black/10 bg-white text-black'
              }`}
            aria-hidden
          >
            {product.label}
          </span>
        )}
      </div>
      <div className="mt-3">
        <Link
          href={product.href}
          className={`line-clamp-2 font-medium ${isDark ? 'text-white/95 transition hover:text-white' : 'text-neutral-800 hover:text-neutral-600'
            }`}
        >
          {product.name}
        </Link>
        <p className={`mt-1 font-mono text-lg font-semibold ${isDark ? 'text-gradient-gold' : 'text-neutral-800'}`}>
          {product.priceFormatted}
        </p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} isDark={isDark} />
        <Link
          href={product.href}
          className={`mt-3 inline-flex h-11 w-full items-center justify-center rounded-full text-center text-sm font-semibold tracking-wider transition ${isDark
            ? 'bg-linear-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_20px_-10px_rgba(234,88,12,0.55)] hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.65)]'
            : 'border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white'
            }`}
        >
          {buyNowLabel}
        </Link>
      </div>
    </article>
  )
}
