'use client'

import { API_ROUTES } from '@/constants/apiRouter'
import type { Order } from '@/models/order'
import type { PaginatedData } from '@/types/response.type'
import { useQuery } from '@tanstack/react-query'

export type AdminOrdersQuery = {
  page?: number
  size?: number
  status?: string | null
  search?: string | null
}

function buildOrdersQueryString(q: AdminOrdersQuery): string {
  const params = new URLSearchParams({
    page: String(q.page ?? 1),
    size: String(q.size ?? 20),
  })
  if (q.status?.trim()) params.set('status', q.status.trim())
  if (q.search?.trim()) params.set('search', q.search.trim())
  return params.toString()
}

async function fetchOrders(q: AdminOrdersQuery): Promise<PaginatedData<Order[]>> {
  const qs = buildOrdersQueryString(q)
  const res = await fetch(`${API_ROUTES.ORDERS.GET_ALL}?${qs}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Không tải được danh sách đơn hàng')
  return res.json()
}

export function useAdminOrders(q: AdminOrdersQuery) {
  return useQuery({
    queryKey: ['@admin-orders', q.page, q.size, q.status, q.search],
    queryFn: () => fetchOrders(q),
    placeholderData: (prev) => prev,
  })
}