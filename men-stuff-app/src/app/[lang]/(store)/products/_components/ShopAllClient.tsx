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

const SEARCH_HISTORY_KEY = 'menstuffs_search_history'

type SearchHistoryItem = {
  term: string
  categoryId?: string
  date: string
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat(LOCALE_VI, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value)
}

function mapProductsToPlaceholder(
  products: Product[] | null | undefined,
  basePath: string
): PlaceholderProduct[] {
  if (!products) return []
  return products.map((p) => ({
    id: p.id,
    name: p.name ?? 'Sản phẩm',
    price: p.price ?? 0,
    priceFormatted: formatPrice(p.price ?? 0),
    imageUrl:
      p.origin_image ||
      'https://placehold.co/400x400/f5f5f5/999?text=Product',
    href: `${basePath}/product/${p.id}`,
    rating: 0,
    reviewCount: 0,
    label: 'new',
  }))
}

function saveSearchHistory(entry: SearchHistoryItem) {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(SEARCH_HISTORY_KEY)
    const parsed: SearchHistoryItem[] = raw ? JSON.parse(raw) : []
    const next = [
      entry,
      // tránh trùng lặp nhiều entry giống hệt nhau liên tiếp
      ...parsed.filter(
        (item) =>
          item.term !== entry.term ||
          item.categoryId !== entry.categoryId
      ),
    ].slice(0, 20)
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
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
    : ((categoriesData as unknown) as { data?: CategoryItem[] })?.data ?? []

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

  const products = mapProductsToPlaceholder(
    (response as { data?: Product[] })?.data ?? null,
    BASE_PATH
  )
  const total = (response as { total?: number })?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const applyFilters = useCallback(() => {
    setSearch(searchInput.trim())
    setCategoryId((c) => c)
    if (searchInput.trim() || categoryId) {
      saveSearchHistory({
        term: searchInput.trim(),
        categoryId: categoryId || undefined,
        date: new Date().toISOString(),
      })
    }
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
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">
          Shop All
        </h1>
        <p className="text-neutral-400">
          Khám phá toàn bộ sản phẩm — tìm kiếm, lọc theo danh mục và thời gian.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Tìm kiếm
            </label>
            <input
              type="search"
              placeholder="Tên sản phẩm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Danh mục
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
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
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
            >
              Áp dụng
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 hover:bg-neutral-800 transition"
            >
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {isError && (
        <p className="mb-4 text-sm text-red-400">
          Không thể tải sản phẩm. Vui lòng thử lại.
        </p>
      )}

      {isLoading && products.length === 0 ? (
        <p className="text-neutral-400 py-12">Đang tải...</p>
      ) : products.length === 0 ? (
        <p className="text-neutral-400 py-12">Không có sản phẩm nào phù hợp.</p>
      ) : (
        <>
          <p className="text-sm text-neutral-500 mb-4">
            Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total} sản phẩm
          </p>
          <ProductGrid
            products={products}
            buyNowLabel="Thêm vào giỏ"
            columns={4}
            variant="dark"
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label="Phân trang"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition"
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
                className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition"
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
