import CategoriesTable from '@/app/[lang]/(admin)/dashboard/_components/CategoriesTable'
import { getAllCategoryMutation } from '@/app/_hooks/getAllCategoryMutation'
import type { Category } from '@/app/_types/category'
import { getDictionary, isValidLocale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function AdminCategoriesPage({ params }: PageProps) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)
  const res = await getAllCategoryMutation()
  const categories = (Array.isArray(res) ? res : res?.data ?? (res?.error ? [] : [])) as Category[]
  const error = !Array.isArray(res) && res?.error ? String(res.error) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-black tracking-tight">{dict.admin.categories}</h1>
        <Button asChild>
          <Link href={`/${locale}/categories-management/new`}>
            {dict.admin.createCategory}
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-3 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      <CategoriesTable
        variant="white"
        categories={categories}
        locale={locale}
        dict={{
          categoryName: dict.admin.categoryName,
          slug: dict.admin.productSlug,
          actions: dict.admin.actions,
          noCategories: dict.admin.noCategories,
          createCategory: dict.admin.createCategory,
          prev: dict.admin.prev,
          next: dict.admin.next,
          pageOf: dict.admin.pageOf,
          rowsPerPage: dict.admin.rowsPerPage,
          editCategory: dict.admin.editCategory,
        }}
        createCategoryHref={`/${locale}/categories-management/new`}
      />
    </div>
  )
}
