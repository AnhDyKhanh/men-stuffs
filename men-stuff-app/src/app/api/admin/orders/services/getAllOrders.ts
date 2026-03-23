import { getSupabaseAdmin } from '@/lib/supabase'
import type { Order } from '@/models/order'
import type { PaginatedData } from '@/types/response.type'

export type GetOrdersOptions = {
  page?: number
  size?: number
  status?: string | null
  search?: string | null
}

export async function getAllOrders(options: GetOrdersOptions = {}): Promise<PaginatedData<Order[]>> {
  const { page = 1, size = 20, status, search } = options

  const safePage = Math.max(1, Number(page))
  const safeSize = Math.max(1, Math.min(100, Number(size)))
  const from = (safePage - 1) * safeSize
  const to = from + safeSize - 1

  try {
    const supabase = getSupabaseAdmin()

    let query = supabase.from('orders').select('*', { count: 'exact' })

    if (status?.trim()) {
      query = query.eq('status', status.trim())
    }

    if (search?.trim()) {
      const raw = search.trim().replace(/[,%]/g, '').replace(/%/g, '')
      const pattern = `%${raw}%`
      query = query.or(
        `order_code.ilike.${pattern},receiver_name.ilike.${pattern},receiver_phone.ilike.${pattern}`,
      )
    }

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)

    if (error) throw error

    return {
      data: (data ?? []) as Order[],
      total: count ?? 0,
      error: null,
      message: null,
      status: 200,
    }
  } catch (error: unknown) {
    console.error('[API GET /api/admin/orders] exception:', error)
    return {
      data: null,
      total: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
      message: null,
      status: 500,
    }
  }
}
