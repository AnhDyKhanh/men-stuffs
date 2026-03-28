'use client'
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
import { InputNumber } from '@/components/ui/input-number'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getAllCategoryMutation } from '@/hooks/getAllCategoryMutation'
import { useCreateProductMutation } from '@/hooks/useCreateProductMutation'
import type { ProductStatus } from '@/models/product'
import type { Category } from '@/types/category'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export type CreateProductDialogProps = {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onCreatedAction?: () => void
}

export default function CreateProductDialog({ open, onOpenChangeAction, onCreatedAction }: CreateProductDialogProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [discountPrice, setDiscountPrice] = useState<number | ''>('')
  const [material, setMaterial] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [status, setStatus] = useState<ProductStatus>('active')

  const { mutate: createProductMutation, isPending: isSubmitting } = useCreateProductMutation()

  const resetForm = useCallback(() => {
    setCategoryId('')
    setName('')
    setDescription('')
    setPrice('')
    setDiscountPrice('')
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
    if (!open) return
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
  }, [open])

  const handleOpenChange = useCallback((next: boolean) => {
    if (!next) resetForm()
    onOpenChangeAction(next)
  }, [onOpenChangeAction, resetForm])

  const slug = useMemo(() => slugify(name), [name, slugify])

  const canSubmit = useMemo(() => {
    return (
      categoryId.trim() !== '' &&
      name.trim() !== '' &&
      slug.trim() !== '' &&
      thumbnail !== null &&
      price !== '' &&
      discountPrice !== '' &&
      material.trim() !== '' &&
      description.trim() !== ''
    )
  }, [categoryId, name, slug, thumbnail, price, discountPrice, material, description])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!thumbnail) {
      toast.error('Vui lòng chọn ảnh')
      return
    }
    createProductMutation({
      category_id: categoryId,
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      price: price ? Number(price) : 0,
      discount_price: discountPrice ? Number(discountPrice) : 0,
      material: material.trim(),
      origin_image: thumbnail,
      is_active: status,
    }, {
      onSuccess: () => {
        onCreatedAction?.()
        handleOpenChange(false)
        resetForm()
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Tạo sản phẩm thất bại')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] flex-col overflow-hidden border border-border p-0 text-card-foreground sm:max-w-2xl">

        <DialogHeader className="shrink-0 border-b border-border bg-card p-6">
          <DialogTitle className="text-xl font-bold">Tạo sản phẩm mới</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="create-product-form" onSubmit={handleSubmit} className="space-y-6 pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Danh mục sản phẩm</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="w-full border-input bg-background">
                    <SelectValue placeholder="Chọn danh mục" />
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
                <Select disabled value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
                  <SelectTrigger className="w-full border-input bg-background">
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
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Nhẫn Bạc" className="border-input bg-background" required />
            </div>

            <div className="rounded-lg border border-border bg-accent p-2 text-[11px] text-accent-foreground">
              <span className="font-semibold uppercase mr-2">URL Slug:</span>
              <span className="font-mono">{slug || 'Chưa có...'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Giá gốc (VND)</Label>
                <InputNumber id="price" value={price} onChange={(value) => setPrice(value)} className="border-input bg-background" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Giá khuyến mãi</Label>
                <InputNumber id="discountPrice" value={discountPrice} onChange={(value) => setDiscountPrice(value)} className="border-input bg-background" />
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
            <div className="space-y-3">
              <Label className="font-semibold">Ảnh đại diện sản phẩm <span className="text-red-500">*</span></Label>
              <div className="flex justify-center sm:justify-start">
                <ImageUpload onChange={(file) => setThumbnail(file)} />
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="shrink-0 border-t border-border bg-card p-6">
          <div className="flex w-full justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => handleOpenChange(false)} disabled={isSubmitting} className="text-muted-foreground hover:text-foreground">
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
  )
}
