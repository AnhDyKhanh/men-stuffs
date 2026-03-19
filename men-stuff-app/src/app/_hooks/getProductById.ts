'use client'

import { useQuery } from '@tanstack/react-query'
import { API_ROUTES } from '../_constants/apiRouter'
import { GetProductByIdResponse } from '../api/admin/products/[id]/services/getProductById'

/** GET /api/admin/products/[id] — id phải nằm trong path, không dùng query. */
// export const getProductById = async (id: string) => {
//   const path = API_ROUTES.PRODUCTS.GET_BY_ID.replace(':id', id)
//   const res = await fetch(getFetchUrl(path))
//   const data = await res.json()
//   if (!res.ok) return null
//   if (data && typeof data === 'object' && 'error' in data) return null
//   return data
// }

async function fetchProductById(id: string) {
  const path = API_ROUTES.PRODUCTS.GET_BY_ID.replace(':id', id)
  // Luôn dùng getFetchUrl để tránh lỗi đường dẫn trên Production
  const res = await fetch(path)

  if (!res.ok) throw new Error('Không tìm thấy sản phẩm')
  return res.json()
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: ['@get-product-by-id', id],
    queryFn: () => fetchProductById(id),
    select: (data: GetProductByIdResponse) => data.data,
    enabled: !!id,
  })
}