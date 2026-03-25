import { ProductQueryOptions } from '@/dtos/get-product-list-option.dto'
import { Product } from '@/models/product'
import { PaginatedData } from '@/types/response.type'
import { getSupabase } from '@/lib/supabase'

export async function getAllProducts(options: ProductQueryOptions = {}): Promise<PaginatedData<Product[]>> {
  const {
    page = 1,
    size = 10,
    orderBy = 'created_at',
    ascending = false,
    search,
    categoryId,
    dateFrom,
    dateTo,
  } = options

  const safePage = Math.max(1, Number(page))
  const safeSize = Math.max(1, Number(size))
  const from = (safePage - 1) * safeSize
  const to = from + safeSize - 1

  try {
    const supabase = getSupabase()

    let query = supabase.from('product').select('*', { count: 'exact' })

    if (search?.trim()) {
      query = query.ilike('name', `%${search.trim()}%`)
    }
    if (categoryId?.length) {
      query = query.in('category_id', categoryId)
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    const { data, error, count } = await query.order(orderBy, { ascending }).range(from, to)

    if (error) throw error

    return {
      data: data?.map((p: Product) => ({
        id: p.id,
        category_id: p.category_id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        discount_price: p.discount_price,
        material: p.material,
        is_active: p.is_active,
        created_at: p.created_at,
        updated_at: p.updated_at,
        origin_image: p.origin_image,
      })) || [],
      total: count ?? 0,
      error: null,
      message: null,
      status: 200,
    }
  } catch (error: unknown) {
    console.error('[API GET /api/admin/products] exception:', error)
    return {
      data: null,
      total: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
      message: null,
      status: 500,
    }
  }
}
