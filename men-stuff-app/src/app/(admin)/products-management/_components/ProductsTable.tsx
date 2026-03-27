'use client'

import DeleteProductButton from '@/app/(admin)/dashboard/_components/DeleteProductButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Product } from '@/models/product'
import dayjs from 'dayjs'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import EditProductDialog from './EditProductDialog'

const PAGE_SIZES = [5, 10, 20, 50] as const

interface ProductsTableProps {
  products: Product[]
  locale: string
  createProductHref: string
  variant?: 'default' | 'white'
}

export default function ProductsTable({
  products,
  locale,
  createProductHref,
  variant = 'default',
}: ProductsTableProps) {
  const isWhite = variant === 'white'
  const cardClass = isWhite ? 'bg-white border-gray-200 shadow-sm' : ''
  const headerClass = isWhite ? 'border-gray-200 bg-gray-50' : 'border-b'
  const headerTextClass = isWhite ? 'text-gray-700 font-medium' : ''
  const rowClass = isWhite ? 'border-gray-200 hover:bg-gray-50' : ''
  const headerRowClass = isWhite ? 'border-gray-200 bg-gray-50' : ''
  const cellClass = isWhite ? 'text-gray-900' : ''
  const mutedClass = isWhite ? 'text-gray-500' : 'text-muted-foreground'
  const selectClass = isWhite ? 'bg-white border-gray-300 text-gray-900' : 'bg-background border-input'
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize))
  const start = (page - 1) * pageSize
  const pageProducts = products.slice(start, start + pageSize)

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
    }).format(value)

  // Hiện tại chỉ dùng theo giờ VN
  const formatDate = (dateInput?: string | Date | null): string => {
    if (!dateInput) return '-'

    // If already in expected "DD/MM/YYYY ..." format, keep it as-is (drop time part)
    if (typeof dateInput === 'string' && /^\d{2}\/\d{2}\/\d{4}/.test(dateInput)) {
      return dateInput.split(' ')[0]
    }

    // Otherwise, parse and format consistently
    const date = dayjs(dateInput)
    if (!date.isValid()) return '-'
    return date.format('DD/MM/YYYY')
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingProduct(null)
  }

  if (products.length === 0) {
    return (
      <Card className={cardClass}>
        <CardContent className={`flex flex-col items-center justify-center py-12 ${isWhite ? 'text-gray-700' : ''}`}>
          <p className={`mb-4 ${mutedClass}`}>Không có sản phẩm</p>
          <Button asChild>
            <Link href={createProductHref}>Thêm sản phẩm mới</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cardClass}>
      <CardHeader className={`${headerClass} px-6 py-4`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className={`text-sm ${mutedClass}`}>
            Số dòng mỗi trang
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              className={`rounded-md border px-2 py-1 text-sm ${selectClass}`}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              Quay lại
            </Button>
            {/* <span className={`min-w-[120px] text-center text-sm ${mutedClass}`}>
              {dict.pageOf.replace('{page}', String(page)).replace('{total}', String(totalPages))}
            </span> */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Tiếp
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className={headerRowClass || rowClass}>
              <TableHead className={`px-6 ${headerTextClass}`}>Tên sản phẩm</TableHead>
              <TableHead className={`px-6 ${headerTextClass}`}>Giá sản phẩm</TableHead>
              <TableHead className={`px-6 ${headerTextClass}`}>Trạng thái</TableHead>
              <TableHead className={`px-6 ${headerTextClass}`}>Ngày tạo</TableHead>
              <TableHead className={`px-6 text-right ${headerTextClass}`}>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageProducts.map((product) => (
              <TableRow key={product.id} className={rowClass}>
                <TableCell className={`px-6 py-4 ${cellClass}`}>
                  <div className="font-medium">{product.name}</div>
                  <div className={`text-xs ${mutedClass}`}>ID: {product.id}</div>
                </TableCell>
                <TableCell className={`px-6 py-4 ${cellClass}`}>{formatPrice(product.price ?? 0)}</TableCell>
                <TableCell className={`px-6 py-4 ${cellClass}`}>
                  <span
                    className={
                      product.is_active === 'active'
                        ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'
                        : `rounded-full px-2 py-0.5 text-xs font-medium ${mutedClass} ${isWhite ? 'bg-gray-100' : 'bg-muted'}`
                    }
                  >
                    {product.is_active === 'active' ? "ACTIVE" : "INACTIVE"}
                  </span>
                </TableCell>
                <TableCell className={`px-6 py-4 text-sm ${cellClass} ${mutedClass}`}>
                  <span className="font-medium">{formatDate(product.created_at)}</span>
                </TableCell>
                <TableCell className={`px-6 py-4 text-right ${cellClass}`}>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Chỉnh sửa</span>
                    </Button>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {editingProduct && (
        <EditProductDialog
          key={editingProduct.id}
          open={isEditDialogOpen}
          initialValues={editingProduct}
          onOpenChangeAction={(open) => {
            if (!open) closeEditDialog()
          }}
        />
      )}
    </Card>
  )
}
