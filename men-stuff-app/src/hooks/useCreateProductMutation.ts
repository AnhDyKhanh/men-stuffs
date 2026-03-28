'use client'

import { CreateProductDTO } from '@/app/api/admin/products/services/createProducts'
import { API_ROUTES } from '@/constants/apiRouter'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

// export type CreateProductDTO = {
//   category_id: string
//   name: string
//   slug: string
//   description: string
//   price: number
//   discount_price: number
//   material: string
//   is_active: 'active' | 'inactive'
//   origin_image: File
// }

async function createProduct(payload: CreateProductDTO) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as string | Blob)
  })

  const res = await fetch(API_ROUTES.PRODUCTS.POST, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Tạo sản phẩm thất bại')
  return res.json()
}

export function useCreateProductMutation() {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      toast.success('Đã tạo sản phẩm thành công')
      return data
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Lỗi hệ thống')
      return error
    },
  })
}
