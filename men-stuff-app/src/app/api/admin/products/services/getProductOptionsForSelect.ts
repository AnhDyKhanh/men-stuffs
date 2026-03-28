import { getSupabase } from '@/lib/supabase'

/** Dữ liệu tối thiểu cho select / multi-select khi gán sản phẩm vào collection. */
export type ProductSelectOption = {
  id: string
  name: string | null
  imageUrl: string | null
}

type Params = {
  /** Lọc theo tên (contains, không phân biệt hoa thường). */
  search?: string
  /** Giới hạn số dòng (mặc định 500, tối đa 1000). */
  limit?: number
}

/**
 * Chỉ đọc `id`, `name`, `origin_image` từ bảng `product` — nhẹ hơn GET /api/admin/products full.
 */
export async function getProductOptionsForSelect(params: Params = {}): Promise<ProductSelectOption[]> {
  const supabase = getSupabase()
  const rawLimit = params.limit ?? 500
  const limit = Math.min(Math.max(Number(rawLimit) || 500, 1), 1000)

  let query = supabase.from('product').select('id, name, origin_image').order('name', { ascending: true }).limit(limit)

  if (params.search?.trim()) {
    query = query.ilike('name', `%${params.search.trim()}%`)
  }

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map((row: { id: string; name: string | null; origin_image: string | null }) => ({
    id: row.id,
    name: row.name,
    imageUrl: row.origin_image,
  }))
}
