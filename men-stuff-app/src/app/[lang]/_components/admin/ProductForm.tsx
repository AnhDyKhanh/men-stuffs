'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Product, ProductStatus } from '@/app/_types/product'

interface ProductFormProps {
  product?: Product
  lang: string
  translations: {
    productName: string
    productNameVi: string
    productNameEn: string
    productPrice: string
    productStatus: string
    active: string
    inactive: string
    save: string
    cancel: string
  }
}

// export type Product = {
//   id: string
//   category_id: string
//   name: string
//   slug: string
//   description: string
//   price: number
//   discount_price: number
//   material: string
//   is_active: string
//   status: ProductStatus
//   created_at: string
// }
/**
 * Product form component for create/edit
 */
export default function ProductForm({ product, lang, translations }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name_vi: product?.name || '',
    name_en: product?.name || '',
    price: product?.price || 0,
    status: (product?.status || 'active') as ProductStatus,
    thumbnail: '/placeholder-product.jpg',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.refresh()
        router.push(`/${lang}/products-management`)
      } else {
        alert('Failed to save product')
      }
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">{translations.productNameVi}</label>
        <input
          type="text"
          value={formData.name_vi}
          onChange={(e) => setFormData({ ...formData, name_vi: e.target.value })}
          className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">{translations.productNameEn}</label>
        <input
          type="text"
          value={formData.name_en}
          onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
          className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">{translations.productPrice}</label>
        <input
          type="number"
          step="1000"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        <p className="mt-1 text-sm text-gray-500">Price in VND</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">{translations.productStatus}</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as ProductStatus,
            })
          }
          className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="active">{translations.active}</option>
          <option value="inactive">{translations.inactive}</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : translations.save}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/${lang}/products-management`)}
          className="rounded-lg bg-gray-200 px-6 py-2 text-black transition hover:bg-gray-300"
        >
          {translations.cancel}
        </button>
      </div>
    </form>
  )
}
