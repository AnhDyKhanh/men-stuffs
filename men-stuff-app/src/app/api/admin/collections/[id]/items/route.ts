import { NextResponse } from 'next/server'
import { requireStaffOr401 } from '@/lib/apiStaffAuth'
import { replaceCollectionItems, isMissingTableError } from '@/app/api/admin/collections/services/collectionQueries'

type Params = { params: Promise<{ id: string }> }

/** PUT /api/admin/collections/:id/items — body { productIds: string[] } (thứ tự = thứ tự hiển thị). */
export async function PUT(request: Request, { params }: Params) {
  const denied = await requireStaffOr401()
  if (denied) return denied
  const { id: collectionId } = await params
  try {
    const body = (await request.json()) as { productIds?: string[] }
    const productIds = Array.isArray(body.productIds) ? body.productIds : []
    await replaceCollectionItems(collectionId, productIds)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if (isMissingTableError(e)) {
      return NextResponse.json({ error: 'Bảng collection chưa tồn tại.' }, { status: 503 })
    }
    console.error('[PUT /api/admin/collections/[id]/items]', e)
    return NextResponse.json({ error: 'Failed to save items — kiểm tra product_id tồn tại.' }, { status: 500 })
  }
}
