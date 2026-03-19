import type { FeaturedCategory } from '@/constants/placeholderData'

interface FeaturedCategoriesSectionProps {
  title: string
  categories: FeaturedCategory[]
}

export default function FeaturedCategoriesSection({ title, categories: _categories }: FeaturedCategoriesSectionProps) {
  return (
    <section className="w-full" aria-labelledby="featured-categories-heading">
      <h2 id="featured-categories-heading" className="mb-8 text-2xl font-semibold text-white md:text-3xl">
        {title}
      </h2>
    </section>
  )
}
