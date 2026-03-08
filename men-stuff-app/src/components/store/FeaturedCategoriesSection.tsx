import type { FeaturedCategory } from '@/app/_constants/placeholderData'

interface FeaturedCategoriesSectionProps {
  title: string
  categories: FeaturedCategory[]
}

export default function FeaturedCategoriesSection({
  title,
  categories: _categories,
}: FeaturedCategoriesSectionProps) {
  return (
    <section
      className="w-full"
      aria-labelledby="featured-categories-heading"
    >
      <h2
        id="featured-categories-heading"
        className="text-2xl font-semibold text-white mb-8 md:text-3xl"
      >
        {title}
      </h2>
    </section>
  )
}
