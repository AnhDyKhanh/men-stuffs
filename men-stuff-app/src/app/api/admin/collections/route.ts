import { NextResponse } from 'next/server'
import { requireStaffOr401 } from '@/lib/apiStaffAuth'
import { isMissingTableError } from '@/app/api/admin/collections/services/collectionErrors'
import { getCollectionsList } from '@/app/api/admin/collections/services/getCollectionsList'
import { createCollectionWithItems } from '@/app/api/admin/collections/services/createCollection'

/**
 * GET /api/admin/collections
 * Danh sách collection kèm sản phẩm (đọc qua service `getCollectionsList`).
 */
export async function GET() {
  const denied = await requireStaffOr401()
  if (denied) return denied
  try {
    const collections = await getCollectionsList()
    return NextResponse.json({ data: collections, error: null })
  } catch (e: unknown) {
    if (isMissingTableError(e)) {
      return NextResponse.json(
        {
          data: [],
          error:
            'Chưa có bảng collection. Chạy scripts/create-collection-tables.sql trong Supabase SQL Editor.',
        },
        { status: 503 },
      )
    }
    console.error('[GET /api/admin/collections]', e)
    return NextResponse.json({ error: 'Failed to list collections' }, { status: 500 })
  }
}

/**
 * POST /api/admin/collections
 * Body: { name: string; description?: string; productIds?: string[] }
 * Tạo collection và (tuỳ chọn) gán sản phẩm — logic trong `createCollectionWithItems`.
 */
export async function POST(request: Request) {
  const denied = await requireStaffOr401()
  if (denied) return denied
  try {
    const body = (await request.json()) as {
      name?: string
      description?: string
      productIds?: string[]
    }
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }
    const data = await createCollectionWithItems({
      name: body.name,
      description: body.description,
      productIds: body.productIds,
    })
    return NextResponse.json({ data, error: null })
  } catch (e: unknown) {
    if (isMissingTableError(e)) {
      return NextResponse.json({ error: 'Bảng collection chưa tồn tại. Chạy create-collection-tables.sql.' }, { status: 503 })
    }
    console.error('[POST /api/admin/collections]', e)
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
  }
}
