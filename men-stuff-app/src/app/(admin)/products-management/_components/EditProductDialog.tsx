'use client'

import { ImageUpload } from '@/components/shared/ImageUpload'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { InputNumber } from '@/components/ui/input-number'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getAllCategoryMutation } from '@/hooks/getAllCategoryMutation'
import { useUpdateProductMutation } from '@/hooks/useUpdateProductMutation'
import type { Product, ProductStatus } from '@/models/product'
import type { Category } from '@/types/category'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type EditProductDialogProps = {
  open: boolean
  initialValues: Product
  onOpenChangeAction: (open: boolean) => void
}

export default function EditProductDialog(props: EditProductDialogProps) {
  const { open, initialValues, onOpenChangeAction } = props
  const router = useRouter()
  const { mutate: updateProductMutation, isPending: isUpdating } = useUpdateProductMutation()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState(initialValues.category_id ?? '')
  const [name, setName] = useState(initialValues.name ?? '')
  const [description, setDescription] = useState(initialValues.description ?? '')
  const [price, setPrice] = useState<number | ''>(initialValues.price ?? '')
  const [discountPrice, setDiscountPrice] = useState<number | ''>(initialValues.discount_price ?? '')
  const [material, setMaterial] = useState(initialValues.material ?? '')
  const [status, setStatus] = useState<ProductStatus>(initialValues.is_active ?? 'active')
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null)
  const queryClient = useQueryClient()
  const slugify = useCallback((value: string) => {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }, [])

  const slug = useMemo(() => slugify(name), [name, slugify])

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
    return () => {
      cancelled = true
    }
  }, [open])

  const closeDialog = useCallback(() => {
    onOpenChangeAction(false)
  }, [onOpenChangeAction])

  const canSubmitEdit = useMemo(() => {
    return (
      categoryId.trim() !== '' &&
      name.trim() !== '' &&
      slug.trim() !== '' &&
      price !== '' &&
      discountPrice !== '' &&
      material.trim() !== '' &&
      description.trim() !== ''
    )
  }, [categoryId, name, slug, price, discountPrice, material, description])

  const handleUpdate = () => {
    updateProductMutation(
      {
        id: initialValues.id,
        category_id: categoryId.trim(),
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        price: Number(price),
        discount_price: Number(discountPrice),
        material: material.trim(),
        is_active: status,
        origin_image: newThumbnail,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['@get-all-products'] })
          closeDialog()
          router.refresh()
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] flex-col overflow-hidden border border-border p-0 text-card-foreground sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border bg-card p-6">
          <DialogTitle className="text-xl font-bold">Chỉnh sửa sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="edit-product-form"
            onSubmit={(e) => {
              e.preventDefault()
              handleUpdate()
            }}
            className="space-y-6 pr-2"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Danh mục sản phẩm</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="w-full border-input bg-background">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
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
              <Label htmlFor="edit-name">Tên sản phẩm</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Nhẫn Bạc"
                className="border-input bg-background"
                required
              />
            </div>

            <div className="rounded-lg border border-border bg-accent p-2 text-[11px] text-accent-foreground">
              <span className="mr-2 font-semibold uppercase">URL Slug:</span>
              <span className="font-mono">{slug || 'Chưa có...'}</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Giá gốc (VND)</Label>
                <InputNumber
                  id="edit-price"
                  value={price}
                  onChange={(value) => setPrice(value)}
                  className="border-input bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discount-price">Giá khuyến mãi</Label>
                <InputNumber
                  id="edit-discount-price"
                  value={discountPrice}
                  onChange={(value) => setDiscountPrice(value)}
                  className="border-input bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-material">Chất liệu</Label>
              <Input
                id="edit-material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="VD: Bạc 925"
                className="border-input bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả sản phẩm</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] border-input bg-background"
              />
            </div>

            {initialValues.origin_image && (
              <div className="space-y-3">
                <Label className="font-semibold">Ảnh hiện tại</Label>
                <div className="flex justify-center sm:justify-start">
                  <div className="relative overflow-hidden rounded-lg border border-border w-full max-w-[300px] h-[200px]">
                    <Image
                      src={initialValues.origin_image}
                      alt={initialValues.name ?? 'Product image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className="font-semibold">Đổi ảnh đại diện (tuỳ chọn)</Label>
              <div className="flex justify-center sm:justify-start">
                <ImageUpload onChange={(file) => setNewThumbnail(file)} />
              </div>
              {newThumbnail && (
                <p className="text-xs text-muted-foreground">
                  Đã chọn ảnh mới: {newThumbnail.name}
                </p>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="shrink-0 border-t border-border bg-card p-6">
          <div className="flex w-full justify-end gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={closeDialog}
              disabled={isUpdating}
              className="text-muted-foreground hover:text-foreground"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              form="edit-product-form"
              disabled={!canSubmitEdit || isUpdating}
              className="min-w-[120px] bg-primary text-primary-foreground hover:opacity-90"
            >
              {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
