'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BASE_PATH } from '@/lib/labels'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  useAdminCollectionsList,
  useCreateAdminCollectionMutation,
  useProductOptionsForSelect,
} from '@/hooks/useProductOptionsForSelect'
import dayjs from 'dayjs'
import { Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'

export default function CollectionsManagementClient() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [productSearch, setProductSearch] = useState('')

  const listQuery = useAdminCollectionsList()
  const collections = listQuery.data ?? []
  const createMutation = useCreateAdminCollectionMutation()

  const productOptionsQuery = useProductOptionsForSelect({
    search: productSearch.trim() || undefined,
    limit: 500,
  })
  const productOptions = productOptionsQuery.data ?? []

  const toggleProduct = useCallback((id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const resetDialog = useCallback(() => {
    setName('')
    setDescription('')
    setSelectedProductIds([])
    setProductSearch('')
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open)
      if (!open) resetDialog()
    },
    [resetDialog],
  )

  const handleSubmit = () => {
    const n = name.trim()
    if (!n) return
    createMutation.mutate(
      {
        name: n,
        description: description.trim() || undefined,
        productIds: selectedProductIds.length > 0 ? selectedProductIds : undefined,
      },
      {
        onSuccess: () => {
          handleOpenChange(false)
        },
      },
    )
  }

  const canSubmit = name.trim().length > 0 && !createMutation.isPending

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return '—'
    const d = dayjs(value)
    return d.isValid() ? d.format('DD/MM/YYYY') : '—'
  }

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Bộ sưu tập</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Tạo và quản lý các bộ sưu tập (combo sản phẩm) hiển thị trên storefront.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`${BASE_PATH}/collections`} target="_blank" rel="noreferrer">
              Xem trang Bộ sưu tập
            </Link>
          </Button>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            Tạo bộ sưu tập
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="border-b border-border px-6 py-4">
          <CardTitle className="text-lg">Danh sách bộ sưu tập</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {listQuery.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang tải...</span>
            </div>
          ) : listQuery.isError ? (
            <div className="px-6 py-12 text-center text-destructive">
              Không tải được danh sách. Thử lại sau.
            </div>
          ) : collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
              <p>Chưa có bộ sưu tập nào.</p>
              <Button onClick={() => setDialogOpen(true)} variant="default">
                Tạo bộ sưu tập đầu tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="px-6 text-foreground">Tên</TableHead>
                  <TableHead className="px-6 text-foreground">Mô tả</TableHead>
                  <TableHead className="px-6 text-foreground">Số sản phẩm</TableHead>
                  <TableHead className="px-6 text-foreground">Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((c) => (
                  <TableRow key={c.id} className="border-border">
                    <TableCell className="px-6 py-4 font-medium text-foreground">{c.name}</TableCell>
                    <TableCell className="max-w-md truncate px-6 py-4 text-muted-foreground">
                      {c.description ?? '—'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-foreground">{c.products?.length ?? 0}</TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {formatDate(c.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[90vh] max-w-lg flex-col gap-0 overflow-hidden border-border p-0 sm:max-w-lg">
          <DialogHeader className="shrink-0 border-b border-border bg-card px-6 py-4">
            <DialogTitle className="text-xl font-semibold">Tạo bộ sưu tập</DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-hidden px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="coll-name">Tên bộ sưu tập</Label>
              <Input
                id="coll-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Black Silver"
                className="border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coll-desc">Mô tả (tuỳ chọn)</Label>
              <Input
                id="coll-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn hiển thị trên storefront"
                className="border-input bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coll-product-search">Chọn sản phẩm trong bộ</Label>
              <Input
                id="coll-product-search"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Tìm theo tên sản phẩm..."
                className="border-input bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Tích chọn sản phẩm; thứ tự chọn = thứ tự hiển thị trong bộ.
              </p>
            </div>

            <ScrollArea className="h-[min(280px,40vh)] rounded-md border border-border bg-muted/20 p-2">
              {productOptionsQuery.isLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải sản phẩm...
                </div>
              ) : productOptions.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Không có sản phẩm phù hợp.</p>
              ) : (
                <ul className="space-y-1 pr-3">
                  {productOptions.map((p) => {
                    const checked = selectedProductIds.includes(p.id)
                    return (
                      <li key={p.id}>
                        <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted/80">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleProduct(p.id)}
                            className="size-4 shrink-0 rounded border-input"
                          />
                          <span className="relative size-10 shrink-0 overflow-hidden rounded border border-border bg-background">
                            {p.imageUrl ? (
                              <Image src={p.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                            ) : (
                              <span className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                                —
                              </span>
                            )}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                            {p.name ?? p.id}
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}
            </ScrollArea>
          </div>

          <DialogFooter className="shrink-0 border-t border-border bg-card px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Hủy
            </Button>
            <Button type="button" disabled={!canSubmit} onClick={handleSubmit}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Xác nhận tạo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
