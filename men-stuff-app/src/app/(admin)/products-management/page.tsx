'use client'

import ProductsTable from '@/app/(admin)/dashboard/_components/ProductsTable'
import { ImageUpload } from '@/components/shared/ImageUpload'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'; // Dùng Shadcn Textarea cho đồng bộ
import { getAllCategoryMutation } from '@/hooks/getAllCategoryMutation'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import { useCreateProductMutation } from '@/hooks/useCreateProductMutation'
import { BASE_PATH } from '@/lib/labels'
import type { ProductStatus } from '@/models/product'
import type { Category } from '@/types/category'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function AdminProductsPage() {
  const productsQuery = useGetAllProducts({
    page: 0,
    size: 100,
    orderBy: 'created_at',
    ascending: false,
  })
  const { data: productsData, refetch } = productsQuery
  const products = productsData?.data ?? []
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // States cho Form
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [discountPrice, setDiscountPrice] = useState<number>(0)
  const [material, setMaterial] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [status, setStatus] = useState<ProductStatus>('active')
  const createProductMutation = useCreateProductMutation()
  const isSubmitting = createProductMutation.isPending

  const resetForm = useCallback(() => {
    setCategoryId('')
    setName('')
    setSlug('')
    setDescription('')
    setPrice(0)
    setDiscountPrice(0)
    setMaterial('')
    setThumbnail(null)
    setStatus('active')
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
      try {
        const payload = await getAllCategoryMutation()
        const data = (payload?.data ?? payload) as Category[] | undefined
        if (!cancelled) setCategories(data ?? [])
      } catch {
        if (!cancelled) setCategories([])
      }
    }
    void loadCategories()
    return () => { cancelled = true }
  }, [isOpen])

  const handleNameChange = useCallback((value: string) => {
    setName(value)
    if (!slug.trim()) setSlug(slugify(value))
  }, [slug, slugify])

  const canSubmit = useMemo(() => {
    return (
      categoryId.trim() !== '' &&
      name.trim() !== '' &&
      slug.trim() !== '' &&
      thumbnail !== null &&
      price >= 0
    )
  }, [categoryId, name, slug, thumbnail, price])

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!thumbnail) {
      toast.error('Vui lòng chọn ảnh')
      return
    }
    try {
      await createProductMutation.mutateAsync({
        category_id: categoryId,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        price,
        discount_price: discountPrice,
        material: material.trim(),
        origin_image: thumbnail,
        is_active: status,
      })

      setIsOpen(false)
      resetForm()
      await refetch()
      toast.success('Đã tạo sản phẩm thành công')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi hệ thống')
    }
  }

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
        <Button onClick={() => setIsOpen(true)} className="bg-primary text-primary-foreground hover:opacity-90">
          Tạo sản phẩm mới
        </Button>
      </div>

      <ProductsTable products={products} locale="vi" createProductHref={`${BASE_PATH}/products-management/new`} />

      <Dialog open={isOpen} onOpenChange={(val) => { setIsOpen(val); if (!val) resetForm(); }}>
        {/* Sửa: Thêm h-[90vh] và flex-col vào Content để kiểm soát layout */}
        <DialogContent className="flex h-[90vh] max-h-[90vh] flex-col overflow-hidden border border-border p-0 text-card-foreground sm:max-w-2xl">

          {/* FIXED HEADER */}
          <DialogHeader className="shrink-0 border-b border-border bg-card p-6">
            <DialogTitle className="text-xl font-bold">Tạo sản phẩm mới</DialogTitle>
          </DialogHeader>

          {/* SCROLLABLE BODY - Dùng div với overflow-y-auto thay vì ScrollArea nếu bị lỗi layout */}
          <div className="flex-1 overflow-y-auto p-6">
            <form id="create-product-form" onSubmit={handleCreateProduct} className="space-y-6 pr-2">

              {/* Upload Ảnh */}
              <div className="space-y-3">
                <Label className="font-semibold">Ảnh đại diện sản phẩm <span className="text-red-500">*</span></Label>
                <div className="flex justify-center sm:justify-start">
                  <ImageUpload onChange={(file) => setThumbnail(file)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="border-input bg-background">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
                    <SelectTrigger className="border-input bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang bán</SelectItem>
                      <SelectItem value="inactive">Ngừng bán</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input id="name" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="VD: Nhẫn Bạc Helios" className="border-input bg-background" required />
              </div>

              <div className="rounded-lg border border-border bg-accent p-2 text-[11px] text-accent-foreground">
                <span className="font-semibold uppercase mr-2">URL Slug:</span>
                <span className="font-mono">{slug || 'Chưa có...'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá gốc (VND)</Label>
                  <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="border-input bg-background" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Giá khuyến mãi</Label>
                  <Input id="discountPrice" type="number" value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value))} className="border-input bg-background" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Chất liệu</Label>
                <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="VD: Bạc 925" className="border-input bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả sản phẩm</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[120px] border-input bg-background" />
              </div>
            </form>
          </div>

          {/* FIXED FOOTER */}
          <DialogFooter className="shrink-0 border-t border-border bg-card p-6">
            <div className="flex w-full justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting} className="text-muted-foreground hover:text-foreground">
                Hủy
              </Button>
              <Button
                type="submit"
                form="create-product-form"
                disabled={isSubmitting || !canSubmit}
                className="min-w-[120px] bg-primary text-primary-foreground hover:opacity-90"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}