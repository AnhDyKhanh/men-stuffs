import { labels, BASE_PATH } from '@/lib/labels'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ lang: string; id: string }>
}

export default async function AdminCategoryEditPage({ params }: PageProps) {
  const { id } = await params
  const dict = labels.admin

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`${BASE_PATH}/categories-management`}>{dict.backToCategories}</Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{dict.editCategory} – {id}</h1>
      <p className="text-muted-foreground">Form chỉnh sửa danh mục (chưa implement).</p>
    </div>
  )
}
