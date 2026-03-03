import CategoriesTable from '@/app/[lang]/(admin)/dashboard/_components/CategoriesTable'
import { getAllCategoryMutation } from '@/app/_hooks/getAllCategoryMutation'
import type { Category } from '@/app/_types/category'
import { labels, BASE_PATH } from '@/lib/labels'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function AdminCategoriesPage({ params }: PageProps) {
  await params
  const dict = labels.admin
  const res = await getAllCategoryMutation()
  const categories = (Array.isArray(res) ? res : res?.data ?? (res?.error ? [] : [])) as Category[]
  const error = !Array.isArray(res) && res?.error ? String(res.error) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-black tracking-tight">{dict.categories}</h1>
        <Button asChild>
          <Link href={`${BASE_PATH}/categories-management/new`}>
            {dict.createCategory}
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
        locale="vi"
        dict={{
          categoryName: dict.categoryName,
          slug: dict.productSlug,
          actions: dict.actions,
          noCategories: dict.noCategories,
          createCategory: dict.createCategory,
          prev: dict.prev,
          next: dict.next,
          pageOf: dict.pageOf,
          rowsPerPage: dict.rowsPerPage,
          editCategory: dict.editCategory,
        }}
        createCategoryHref={`${BASE_PATH}/categories-management/new`}
      />
    </div>
  )
}
