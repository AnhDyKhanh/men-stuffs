import { getSupabaseAdmin } from '@/lib/supabase'
import type { Order } from '@/models/order'

export type GetAllOrdersOptions = {
  page: number
  size: number
  status?: string | null
}

export async function getAllOrders({ page, size, status }: GetAllOrdersOptions) {
  const supabase = getSupabaseAdmin()
  const from = page * size
  const to = from + size - 1

  let q = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status?.trim()) {
    q = q.eq('status', status.trim())
  }

  const { data, error, count } = await q.range(from, to)

  if (error) {
    console.error('[getAllOrders]', error)
    return { data: [] as Order[], total: 0, error: error.message }
  }

  return {
    data: (data ?? []) as Order[],
    total: count ?? 0,
    error: null as string | null,
  }
}
