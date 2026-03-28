import { NextResponse } from 'next/server'
import { getProductOptionsForSelect } from '@/app/api/admin/products/services/getProductOptionsForSelect'

/**
 * GET /api/admin/products/options
 * Trả về danh sách tối giản: id, name, imageUrl — dùng cho select khi tạo / chỉnh collection.
 *
 * Query (tuỳ chọn):
 * - search: string — lọc theo tên
 * - limit: number — mặc định 500, tối đa 1000
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') ?? undefined
    const limitRaw = searchParams.get('limit')
    const limit = limitRaw ? parseInt(limitRaw, 10) : undefined

    const data = await getProductOptionsForSelect({
      search,
      limit: Number.isFinite(limit) ? limit : undefined,
    })
    return NextResponse.json({ data, error: null })
  } catch (e: unknown) {
    console.error('[GET /api/admin/products/options]', e)
    return NextResponse.json(
      { data: [], error: e instanceof Error ? e.message : 'Failed to fetch product options' },
      { status: 500 },
    )
  }
}
