import { getDictionary, isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ lang: string; id: string }>
}

export default async function AdminCategoryEditPage({ params }: PageProps) {
  const { lang, id } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/categories-management`}>{dict.admin.backToCategories}</Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{dict.admin.editCategory} – {id}</h1>
      <p className="text-muted-foreground">Form chỉnh sửa danh mục (chưa implement).</p>
    </div>
  )
}
