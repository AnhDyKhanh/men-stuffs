import Link from 'next/link'
import Image from 'next/image'
import type { FeaturedCategory } from '@/app/_constants/placeholderData'

interface FeaturedCategoriesSectionProps {
  title: string
  categories: FeaturedCategory[]
  /** Dark background variant (white text, dark cards) */
  variant?: 'default' | 'dark'
}

export default function FeaturedCategoriesSection({
  title,
  categories,
  variant = 'default',
}: FeaturedCategoriesSectionProps) {
  if (categories.length === 0) return null

  const isDark = variant === 'dark'

  return (
    <section
      className="w-full"
      aria-labelledby="featured-categories-heading"
    >
      <h2
        id="featured-categories-heading"
        className={`text-2xl font-semibold mb-8 md:text-3xl ${isDark ? 'text-white' : 'text-neutral-900'}`}
      >
        {title}
      </h2>
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        role="list"
      >
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={cat.href}
              className={`group relative block overflow-hidden rounded-xl transition ${
                isDark
                  ? 'bg-neutral-800 border border-neutral-600 hover:border-neutral-500 hover:shadow-lg'
                  : 'bg-neutral-100 border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300'
              }`}
            >
              <div className="aspect-[3/2] relative overflow-hidden">
                <Image
                  src={cat.imageUrl}
                  alt=""
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                />
                <div className={`absolute inset-0 transition ${isDark ? 'bg-black/40 group-hover:bg-black/50' : 'bg-black/20 group-hover:bg-black/30'}`} />
              </div>
              <div className="p-4">
                <h3 className={`font-semibold ${isDark ? 'text-white group-hover:text-neutral-200' : 'text-neutral-900 group-hover:text-neutral-700'}`}>
                  {cat.title}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
