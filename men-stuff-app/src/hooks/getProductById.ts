'use client'

import { useQuery } from '@tanstack/react-query'
import { API_ROUTES } from '../constants/apiRouter'
import { GetProductByIdResponse } from '../app/api/admin/products/[id]/services/getProductById'
import { apiFetch } from '@/lib/apiFetch'

async function fetchProductById(id: string) {
  const url = API_ROUTES.PRODUCTS.GET_BY_ID.replace(':id', id)
  return apiFetch(url)
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: ['@get-product-by-id', id],
    queryFn: () => fetchProductById(id),
    select: (data: GetProductByIdResponse) => data.data,
    enabled: !!id,
  })
}