'use client'

import { API_ROUTES } from '@/constants/apiRouter'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export type UpdateProductDTO = {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  price: number
  discount_price: number
  material: string
  is_active: 'active' | 'inactive'
  origin_image?: File | null
}

async function updateProduct(payload: UpdateProductDTO) {
  const { id, ...rest } = payload
  const formData = new FormData()

  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    formData.append(key, value as string | Blob)
  })

  const res = await fetch(API_ROUTES.PRODUCTS.PUT.replace(':id', id), {
    method: 'PUT',
    body: formData,
  })

  if (!res.ok) throw new Error('Cập nhật sản phẩm thất bại')
  return res.json()
}

export function useUpdateProductMutation() {
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      toast.success('Đã cập nhật sản phẩm thành công')
      return data
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Lỗi hệ thống')
      return error
    },
  })
}
