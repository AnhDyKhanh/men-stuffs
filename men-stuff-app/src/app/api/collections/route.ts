import { NextResponse } from 'next/server'
import { listCollectionsWithProducts, isMissingTableError } from '@/app/api/admin/collections/services/collectionQueries'

/**
 * GET /api/collections — storefront: danh sách bộ sưu tập + sản phẩm (đọc server, không cần đăng nhập).
 */
export async function GET() {
  try {
    const collections = await listCollectionsWithProducts()
    return NextResponse.json({ data: collections, error: null })
  } catch (e: unknown) {
    if (isMissingTableError(e)) {
      return NextResponse.json({
        data: [],
        error: 'Bảng collection chưa được tạo — chạy scripts/create-collection-tables.sql trên Supabase.',
      })
    }
    console.error('[GET /api/collections]', e)
    return NextResponse.json({ data: [], error: 'Failed to load collections' }, { status: 500 })
  }
}
