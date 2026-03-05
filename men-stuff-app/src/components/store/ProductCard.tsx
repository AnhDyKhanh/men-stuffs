import Link from 'next/link'
import type { PlaceholderProduct } from '@/app/_constants/placeholderData'
import Image from 'next/image'

interface ProductCardProps {
  product: PlaceholderProduct
  buyNowLabel?: string
}

const STAR_COUNT = 5

function StarRating({
  rating = 0,
  reviewCount,
}: {
  rating?: number
  reviewCount?: number
}) {
  // if (reviewCount === undefined || reviewCount === 0) return null
  const value = Math.min(STAR_COUNT, Math.max(0, rating))
  return (
    <div
      className="flex items-center gap-1 mt-1"
      role="img"
      aria-label={`${value} out of ${STAR_COUNT} stars`}
    >
      {Array.from({ length: STAR_COUNT }, (_, i) => (
        <span
          key={i}
          className={`text-amber-500 ${i < value ? 'opacity-100' : 'opacity-30'}`}
          aria-hidden
        >
          ★
        </span>
      ))}
      <span className="text-xs text-neutral-500 ml-1" aria-hidden>
        {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
      </span>
    </div>
  )
}

export default function ProductCard({
  product,
  buyNowLabel = 'Buy now',
}: ProductCardProps) {
  console.log('produchuuhuhuht', product)
  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
        <Link
          href={product.href}
          className="block aspect-square"
          aria-label={product.name}
        >
          <Image
            src={product.imageUrl}
            alt=""
            width={400}
            height={400}
            className="h-full w-full object-cover transition group-hover:scale-105"
            unoptimized
          />
        </Link>
        {product.label && (
          <span
            className="absolute top-2 left-2 rounded bg-neutral-900 px-2 py-1 text-xs font-medium uppercase text-white"
            aria-hidden
          >
            {product.label}
          </span>
        )}
      </div>
      <div className="mt-3">
        <Link
          href={product.href}
          className="font-medium text-neutral-200 hover:text-neutral-600 line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-lg font-semibold text-neutral-200">
          {product.priceFormatted}
        </p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <Link
          href={product.href}
          className="mt-3 inline-block w-full rounded-lg border border-neutral-900 py-2.5 text-center text-sm font-medium text-neutral-200 transition hover:bg-neutral-900 hover:text-white"
        >
          {buyNowLabel}
        </Link>
      </div>
    </article>
  )
}
