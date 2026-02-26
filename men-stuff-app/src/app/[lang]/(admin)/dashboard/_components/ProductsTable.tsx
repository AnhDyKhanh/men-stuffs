'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/app/_types/product'
import DeleteProductButton from '@/app/[lang]/_components/admin/DeleteProductButton'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const PAGE_SIZES = [5, 10, 20, 50] as const

export type ProductsTableDict = {
  productName: string
  productPrice: string
  status: string
  createdAt: string
  actions: string
  active: string
  inactive: string
  editProduct: string
  noProducts: string
  createProduct: string
  prev: string
  next: string
  pageOf: string
  rowsPerPage: string
}

interface ProductsTableProps {
  products: Product[]
  locale: string
  dict: ProductsTableDict
  createProductHref: string
  variant?: 'default' | 'white'
}

export default function ProductsTable({
  products,
  locale,
  dict,
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

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize))
  const start = (page - 1) * pageSize
  const pageProducts = products.slice(start, start + pageSize)

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
    }).format(value)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')

  if (products.length === 0) {
    return (
      <Card className={cardClass}>
        <CardContent className={`flex flex-col items-center justify-center py-12 ${isWhite ? 'text-gray-700' : ''}`}>
          <p className={`mb-4 ${mutedClass}`}>{dict.noProducts}</p>
          <Button asChild>
            <Link href={createProductHref}>{dict.createProduct}</Link>
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
            {dict.rowsPerPage}:{' '}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              {dict.prev}
            </Button>
            <span className={`min-w-[120px] text-center text-sm ${mutedClass}`}>
              {dict.pageOf.replace('{page}', String(page)).replace('{total}', String(totalPages))}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              {dict.next}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className={headerRowClass || rowClass}>
              <TableHead className={`px-6 ${headerTextClass}`}>{dict.productName}</TableHead>
              <TableHead className={`px-6 ${headerTextClass}`}>{dict.productPrice}</TableHead>
              <TableHead className={`px-6 ${headerTextClass}`}>{dict.status}</TableHead>
              <TableHead className={`px-6 ${headerTextClass}`}>{dict.createdAt}</TableHead>
              <TableHead className={`px-6 text-right ${headerTextClass}`}>{dict.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageProducts.map((product) => (
              <TableRow key={product.id} className={rowClass}>
                <TableCell className={`px-6 py-4 ${cellClass}`}>
                  <div className="font-medium">{product.name}</div>
                  <div className={`text-xs ${mutedClass}`}>ID: {product.id}</div>
                </TableCell>
                <TableCell className={`px-6 py-4 ${cellClass}`}>{formatPrice(product.price)}</TableCell>
                <TableCell className={`px-6 py-4 ${cellClass}`}>
                  <span
                    className={
                      product.status === 'active'
                        ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'
                        : `rounded-full px-2 py-0.5 text-xs font-medium ${mutedClass} ${isWhite ? 'bg-gray-100' : 'bg-muted'}`
                    }
                  >
                    {product.status === 'active' ? dict.active : dict.inactive}
                  </span>
                </TableCell>
                <TableCell className={`px-6 py-4 text-sm ${cellClass} ${mutedClass}`}>
                  {formatDate(product.created_at)}
                </TableCell>
                <TableCell className={`px-6 py-4 text-right ${cellClass}`}>
                  <div className="flex justify-end gap-3">
                    <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                      <Link href={`/${locale}/products-management/${product.id}`}>
                        {dict.editProduct}
                      </Link>
                    </Button>
                    <DeleteProductButton productId={product.id} lang={locale} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
