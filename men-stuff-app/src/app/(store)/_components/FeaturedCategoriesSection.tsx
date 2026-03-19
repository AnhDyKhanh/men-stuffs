import Link from 'next/link'
import Image from 'next/image'
import type { FeaturedCategory } from '@/constants/placeholderData'

interface FeaturedCategoriesSectionProps {
  title: string
  categories: FeaturedCategory[]
}

export default function FeaturedCategoriesSection({ title, categories: _categories }: FeaturedCategoriesSectionProps) {
  const categories = _categories ?? []
  if (categories.length === 0) return null

  return (
    <section className="w-full" aria-labelledby="featured-categories-heading">
      <h2 id="featured-categories-heading" className="mb-8 text-2xl font-semibold text-white md:text-3xl">
        {title}
      </h2>

      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Featured categories">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={cat.href}
              className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0F1115]/70 transition-all duration-300 hover:-translate-y-1 hover:border-[#F7931A]/50 hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.2)]"
              aria-label={cat.title}
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={cat.imageUrl}
                  alt=""
                  fill
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30" />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white/95 transition group-hover:text-white">{cat.title}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
