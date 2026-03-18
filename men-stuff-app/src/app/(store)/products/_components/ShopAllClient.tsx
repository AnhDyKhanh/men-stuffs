'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { BASE_PATH } from '@/lib/labels'
import ProductGrid from '@/components/store/ProductGrid'
import { useGetAllProducts } from '@/app/_hooks/getAllProductsMutation'
import { useGetAllCategories } from '@/app/_hooks/useGetAllCategories'
import type { Product } from '@/app/_models/product'
import type { PlaceholderProduct } from '@/app/_constants/placeholderData'

type CategoryItem = { id: string; name?: string }

const PAGE_SIZE = 20
const CURRENCY = 'VND'
const LOCALE_VI = 'vi-VN'

function formatPrice(value: number): string {
  return new Intl.NumberFormat(LOCALE_VI, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value)
}

function mapProductsToPlaceholder(products: Product[] | null | undefined, basePath: string): PlaceholderProduct[] {
  if (!products) return []
  return products.map((p) => ({
    id: p.id,
    name: p.name ?? 'Sản phẩm',
    price: p.price ?? 0,
    priceFormatted: formatPrice(p.price ?? 0),
    imageUrl: p.origin_image || 'https://placehold.co/400x400/f5f5f5/999?text=Product',
    href: `${basePath}/product/${p.id}`,
    rating: 0,
    reviewCount: 0,
    label: 'new',
  }))
}

export default function ShopAllClient() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { data: categoriesData } = useGetAllCategories()
  const categories: CategoryItem[] = Array.isArray(categoriesData)
    ? (categoriesData as CategoryItem[])
    : ((categoriesData as unknown as { data?: CategoryItem[] })?.data ?? [])

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAllProducts({
    page,
    size: PAGE_SIZE,
    orderBy: 'created_at',
    ascending: false,
    search: search || undefined,
    categoryId: categoryId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  })

  const products = mapProductsToPlaceholder((response as { data?: Product[] })?.data ?? null, BASE_PATH)
  const total = (response as { total?: number })?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const applyFilters = useCallback(() => {
    setSearch(searchInput.trim())
    setCategoryId((c) => c)
    setPage(1)
  }, [searchInput])

  const clearFilters = useCallback(() => {
    setSearchInput('')
    setSearch('')
    setCategoryId('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">Shop All</h1>
        <p className="text-neutral-400">Khám phá toàn bộ sản phẩm — tìm kiếm, lọc theo danh mục và thời gian.</p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">Tìm kiếm</label>
            <input
              type="search"
              placeholder="Tên sản phẩm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 focus:ring-2 focus:ring-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">Danh mục</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:ring-2 focus:ring-neutral-500 focus:outline-none"
            >
              <option value="">Tất cả</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? c.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">Từ ngày</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:ring-2 focus:ring-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">Đến ngày</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:ring-2 focus:ring-neutral-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-lg bg-white px-4 py-2 font-medium text-black transition hover:bg-neutral-200"
            >
              Áp dụng
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-neutral-600 px-4 py-2 text-neutral-300 transition hover:bg-neutral-800"
            >
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {isError && <p className="mb-4 text-sm text-red-400">Không thể tải sản phẩm. Vui lòng thử lại.</p>}

      {isLoading && products.length === 0 ? (
        <p className="py-12 text-neutral-400">Đang tải...</p>
      ) : products.length === 0 ? (
        <p className="py-12 text-neutral-400">Không có sản phẩm nào phù hợp.</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-neutral-500">
            Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total} sản phẩm
          </p>
          <ProductGrid products={products} buyNowLabel="Thêm vào giỏ" columns={4} />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Phân trang">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-neutral-600 px-4 py-2 text-neutral-300 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2 text-neutral-400">
                Trang {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-neutral-600 px-4 py-2 text-neutral-300 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
