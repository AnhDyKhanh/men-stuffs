'use client'

import type { CollectionWithProducts } from '@/app/api/admin/collections/services/getCollectionsList'
import type { ProductSelectOption } from '@/app/api/admin/products/services/getProductOptionsForSelect'
import { API_ROUTES } from '@/constants/apiRouter'
import { getFetchUrl } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// --- GET /api/admin/products/options ---

export type ProductOptionsQueryParams = {
  search?: string
  limit?: number
}

type ProductOptionsApiResponse = {
  data: ProductSelectOption[]
  error: string | null
}

/**
 * Gọi GET /api/admin/products/options — dùng trực tiếp hoặc qua `useProductOptionsForSelect`.
 */
export async function getProductOptionsForSelectMutation(
  params: ProductOptionsQueryParams = {},
): Promise<ProductSelectOption[]> {
  const searchParams = new URLSearchParams()
  if (params.search?.trim()) searchParams.set('search', params.search.trim())
  if (params.limit != null && Number.isFinite(params.limit)) {
    searchParams.set('limit', String(params.limit))
  }
  const qs = searchParams.toString()
  const base = getFetchUrl(API_ROUTES.PRODUCTS.OPTIONS_FOR_SELECT)
  const url = qs ? `${base}?${qs}` : base

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch product options')
  const json = (await res.json()) as ProductOptionsApiResponse
  return json.data ?? []
}

/**
 * Danh sách sản phẩm tối giản (id, name, imageUrl) cho select khi tạo/chỉnh collection.
 */
export function useProductOptionsForSelect(params: ProductOptionsQueryParams = {}) {
  return useQuery({
    queryKey: ['@product-options-for-select', params.search ?? '', params.limit ?? ''],
    queryFn: () => getProductOptionsForSelectMutation(params),
    placeholderData: (previousData) => previousData,
  })
}

// --- GET/POST /api/admin/collections ---

type CollectionsListApiResponse = {
  data: CollectionWithProducts[]
  error: string | null
}

/**
 * GET /api/admin/collections — danh sách collection kèm products.
 */
export async function fetchAdminCollectionsList(): Promise<CollectionWithProducts[]> {
  const res = await fetch(getFetchUrl(API_ROUTES.COLLECTIONS.ADMIN), { cache: 'no-store' })
  if (!res.ok) throw new Error('Không tải được danh sách collection')
  const json = (await res.json()) as CollectionsListApiResponse
  return json.data ?? []
}

export function useAdminCollectionsList() {
  return useQuery({
    queryKey: ['@admin-collections-list'],
    queryFn: fetchAdminCollectionsList,
    placeholderData: (previousData) => previousData,
  })
}

export type CreateAdminCollectionInput = {
  name: string
  description?: string
  productIds?: string[]
}

type CreateCollectionApiResponse = {
  data: CollectionWithProducts
  error: string | null
}

/**
 * POST /api/admin/collections — tạo collection (tuỳ chọn gán productIds).
 */
async function createAdminCollection(payload: CreateAdminCollectionInput): Promise<CollectionWithProducts> {
  const res = await fetch(getFetchUrl(API_ROUTES.COLLECTIONS.ADMIN), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = (await res.json()) as CreateCollectionApiResponse & { error?: string }
  if (!res.ok) {
    throw new Error(json.error ?? 'Tạo collection thất bại')
  }
  return json.data
}

export function useCreateAdminCollectionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAdminCollection,
    onSuccess: () => {
      toast.success('Đã tạo collection thành công')
      void queryClient.invalidateQueries({ queryKey: ['@admin-collections-list'] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Lỗi hệ thống')
    },
  })
}
