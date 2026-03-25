import { NextResponse } from 'next/server'
import { requireStaffOr401 } from '@/lib/apiStaffAuth'
import {
  insertCollection,
  listCollectionsWithProducts,
  isMissingTableError,
} from '@/app/api/admin/collections/services/collectionQueries'

export async function GET() {
  const denied = await requireStaffOr401()
  if (denied) return denied
  try {
    const collections = await listCollectionsWithProducts()
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

export async function POST(request: Request) {
  const denied = await requireStaffOr401()
  if (denied) return denied
  try {
    const body = (await request.json()) as { name?: string; description?: string }
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }
    const row = await insertCollection({ name: body.name, description: body.description })
    return NextResponse.json({ data: { ...row, products: [] as [] }, error: null })
  } catch (e: unknown) {
    if (isMissingTableError(e)) {
      return NextResponse.json({ error: 'Bảng collection chưa tồn tại. Chạy create-collection-tables.sql.' }, { status: 503 })
    }
    console.error('[POST /api/admin/collections]', e)
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
  }
}
