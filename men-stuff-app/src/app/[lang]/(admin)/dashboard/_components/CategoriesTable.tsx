'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Category } from '@/app/_types/category'
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

export type CategoriesTableDict = {
  categoryName: string
  slug: string
  actions: string
  noCategories: string
  createCategory: string
  prev: string
  next: string
  pageOf: string
  rowsPerPage: string
  editCategory: string
}

interface CategoriesTableProps {
  categories: Category[]
  locale: string
  dict: CategoriesTableDict
  createCategoryHref: string
  variant?: 'default' | 'white'
}

export default function CategoriesTable({
  categories,
  locale,
  dict,
  createCategoryHref,
  variant = 'default',
}: CategoriesTableProps) {
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

  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize))
  const start = (page - 1) * pageSize
  const pageCategories = categories.slice(start, start + pageSize)

  if (categories.length === 0) {
    return (
      <Card className={cardClass}>
        <CardContent className={`flex flex-col items-center justify-center py-12 ${isWhite ? 'text-gray-700' : ''}`}>
          <p className={`mb-4 ${mutedClass}`}>{dict.noCategories}</p>
          <Button asChild>
            <Link href={createCategoryHref}>{dict.createCategory}</Link>
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
              <TableHead className={`px-6 ${headerTextClass}`}>{dict.categoryName}</TableHead>
              <TableHead className={`px-6 ${headerTextClass}`}>{dict.slug}</TableHead>
              <TableHead className={`px-6 text-right ${headerTextClass}`}>{dict.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageCategories.map((cat) => (
              <TableRow key={cat.id} className={rowClass}>
                <TableCell className={`px-6 py-4 ${cellClass}`}>
                  <div className="font-medium">{cat.name ?? '-'}</div>
                  <div className={`text-xs ${mutedClass}`}>ID: {cat.id}</div>
                </TableCell>
                <TableCell className={`px-6 py-4 ${cellClass} ${mutedClass}`}>
                  {cat.slug ?? '-'}
                </TableCell>
                <TableCell className={`px-6 py-4 text-right ${cellClass}`}>
                  <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                    <Link href={`/${locale}/categories-management/${cat.id}`}>
                      {dict.editCategory}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
