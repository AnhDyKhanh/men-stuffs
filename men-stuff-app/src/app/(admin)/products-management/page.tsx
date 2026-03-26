'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ProductsTable from '@/app/(admin)/dashboard/_components/ProductsTable'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import { getAllCategoryMutation } from '@/hooks/getAllCategoryMutation'
import { API_ROUTES } from '@/constants/apiRouter'
import type { Category } from '@/types/category'
import type { ProductStatus } from '@/models/product'
import { toast } from 'sonner'
import { BASE_PATH, labels } from '@/lib/labels'

export default function AdminProductsPage() {
  const dict = labels.admin
  const productsQuery = useGetAllProducts({
    page: 0,
    size: 100,
    orderBy: 'created_at',
    ascending: false,
  })
  const { data: productsData, refetch } = productsQuery
  const products = productsData?.data ?? []
  const error = productsData?.error ? String(productsData.error) : null

  const [isOpen, setIsOpen] = useState(false)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [discountPrice, setDiscountPrice] = useState<number>(0)
  const [material, setMaterial] = useState('')
  const [status, setStatus] = useState<ProductStatus>('active')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = useCallback(() => {
    setCategoryId('')
    setName('')
    setSlug('')
    setDescription('')
    setPrice(0)
    setDiscountPrice(0)
    setMaterial('')
    setStatus('active')
    setIsSubmitting(false)
  }, [])

  const slugify = useCallback((value: string) => {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }, [])

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    async function loadCategories() {
      setIsCategoriesLoading(true)
      try {
        const payload = await getAllCategoryMutation()
        const data = (payload?.data ?? payload) as Category[] | undefined
        if (!cancelled) setCategories(data ?? [])
      } catch {
        if (!cancelled) setCategories([])
      } finally {
        if (!cancelled) setIsCategoriesLoading(false)
      }
    }

    void loadCategories()
    return () => {
      cancelled = true
    }
  }, [isOpen])

  useEffect(() => {
    // Auto-generate slug when user types name.
    if (!isOpen) return
    setSlug((prev) => (prev.trim() ? prev : slugify(name)))
  }, [name, slugify, isOpen])

  const canSubmit = useMemo(() => {
    if (!categories.length) return false
    if (!categoryId.trim()) return false
    if (!name.trim()) return false
    if (!slug.trim()) return false
    if (!description.trim()) return false
    if (!material.trim()) return false
    if (price == null || discountPrice == null) return false
    return true
  }, [categories.length, categoryId, name, slug, description, material, price, discountPrice])

  const handleCreateProduct = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!canSubmit) {
        toast.error('Vui lòng nhập đầy đủ thông tin và chọn category trước.')
        return
      }
      if (categories.length === 0) {
        toast.error('Chưa có category. Hãy tạo category trước.')
        return
      }

      setIsSubmitting(true)
      try {
        const res = await fetch(API_ROUTES.PRODUCTS.POST, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category_id: categoryId,
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            price,
            discount_price: discountPrice,
            material: material.trim(),
            is_active: status,
          }),
        })

        const payload = (await res.json().catch(() => null)) as { error?: string; data?: unknown } | null
        if (!res.ok) {
          throw new Error(payload?.error || 'Tạo sản phẩm thất bại')
        }

        setIsOpen(false)
        resetForm()
        await refetch()
        toast.success('Đã tạo sản phẩm')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Tạo sản phẩm thất bại'
        toast.error(msg)
      } finally {
        setIsSubmitting(false)
      }
    },
    [canSubmit, categories.length, categoryId, discountPrice, description, material, name, refetch, resetForm, slug, status, price],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-black">{dict.products}</h1>
        <Button type="button" onClick={() => setIsOpen(true)}>
          {dict.createProduct}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="text-destructive py-3 text-sm">{error}</CardContent>
        </Card>
      )}

      <ProductsTable
        variant="white"
        products={products}
        locale="vi"
        createProductHref={`${BASE_PATH}/products-management/new`}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[85vh] overflow-auto border-slate-200 bg-white text-slate-900 sm:max-w-2xl p-4">
          <DialogHeader>
            <DialogTitle>Tạo sản phẩm mới</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateProduct} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={isCategoriesLoading}>
                <SelectTrigger id="categoryId" className="h-11">
                  <SelectValue placeholder={isCategoriesLoading ? 'Đang tải...' : 'Chọn category'} />
                </SelectTrigger>
                <SelectContent>
                  {(categories ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name ?? c.slug ?? c.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isCategoriesLoading && categories.length === 0 && (
                <p className="text-sm text-slate-600">
                  Trước đó phải có category (chưa thấy data).
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              <p className="text-xs text-slate-500">Dùng để tạo đường dẫn (tự sinh từ tên).</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={1000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPrice">Giá khuyến mãi</Label>
              <Input
                id="discountPrice"
                type="number"
                min={0}
                step={1000}
                value={discountPrice}
                onChange={(e) => setDiscountPrice(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Chất liệu</Label>
              <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[90px] w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
                <SelectTrigger id="status" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{dict.active}</SelectItem>
                  <SelectItem value="inactive">{dict.inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  resetForm()
                }}
                disabled={isSubmitting}
              >
                {dict.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting || !canSubmit}>
                {isSubmitting ? 'Đang tạo...' : dict.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
