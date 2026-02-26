import { getDictionary, isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function AdminCategoryNewPage({ params }: PageProps) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/categories-management`}>{dict.admin.backToCategories}</Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{dict.admin.createCategory}</h1>
      <p className="text-muted-foreground">Form tạo danh mục mới (chưa implement).</p>
    </div>
  )
}
