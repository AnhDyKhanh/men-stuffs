import type { FeaturedCategory } from '@/constants/placeholderData'

interface FeaturedCategoriesSectionProps {
  title: string
  categories: FeaturedCategory[]
}

/**
 * Chỉ hiển thị tiêu đề khu vực (không còn lưới ảnh danh mục).
 * Giữ prop `categories` để tránh đổi API cha / conflict PR.
 */
export default function FeaturedCategoriesSection({ title, categories: _categories }: FeaturedCategoriesSectionProps) {
  void _categories

  if (!title?.trim()) return null

  return (
    <section className="w-full" aria-labelledby="featured-categories-heading">
      <h2 id="featured-categories-heading" className="mb-8 text-2xl font-semibold text-white md:text-3xl">
        {title}
      </h2>
    </section>
  )
}
