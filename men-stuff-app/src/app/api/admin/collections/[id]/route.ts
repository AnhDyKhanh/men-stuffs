import { NextResponse } from 'next/server'
import { requireStaffOr401 } from '@/lib/apiStaffAuth'
import {
  deleteCollection,
  updateCollection,
  isMissingTableError,
} from '@/app/api/admin/collections/services/collectionQueries'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireStaffOr401()
  if (denied) return denied
  const { id } = await params
  try {
    const body = (await request.json()) as { name?: string; description?: string | null }
    await updateCollection(id, body)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if (isMissingTableError(e)) {
      return NextResponse.json({ error: 'Bảng collection chưa tồn tại.' }, { status: 503 })
    }
    console.error('[PATCH /api/admin/collections/[id]]', e)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireStaffOr401()
  if (denied) return denied
  const { id } = await params
  try {
    await deleteCollection(id)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if (isMissingTableError(e)) {
      return NextResponse.json({ error: 'Bảng collection chưa tồn tại.' }, { status: 503 })
    }
    console.error('[DELETE /api/admin/collections/[id]]', e)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
