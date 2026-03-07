'use client'

import { useQuery } from '@tanstack/react-query'
import { API_ROUTES } from '../_constants/apiRouter'
import type { ProductQueryOptions } from '../_dtos/get-product-list-option.dto'
import type { Product } from '../_models/product'
import type { PaginatedData } from '../_types/response.type'

function buildProductsQueryString(options: ProductQueryOptions): string {
  const params = new URLSearchParams({
    page: String(options.page ?? 0),
    size: String(options.size ?? 20),
    orderBy: options.orderBy ?? 'created_at',
    ascending: String(options.ascending ?? false),
  })
  if (options.categoryId) params.set('category', options.categoryId)
  if (options.search) params.set('q', options.search)
  return params.toString()
}

async function fetchAllProducts(
  options: ProductQueryOptions
): Promise<PaginatedData<Product[]>> {
  const query = buildProductsQueryString(options)
  const url = `${API_ROUTES.PRODUCTS.GET_ALL}?${query}`

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export function useGetAllProducts(options: ProductQueryOptions) {
  return useQuery({
    queryKey: [
      '@get-all-products',
      options.page,
      options.size,
      options.orderBy,
      options.ascending,
      options.categoryId,
      options.search,
    ],
    queryFn: () => fetchAllProducts(options),
    placeholderData: (prev) => prev,
  })
}