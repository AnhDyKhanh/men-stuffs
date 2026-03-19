'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { BASE_PATH } from '@/lib/labels'
import ProductGrid from '@/app/(store)/_components/ProductGrid'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import { useGetAllCategories } from '@/hooks/useGetAllCategories'
import type { Product } from '@/models/product'
import type { PlaceholderProduct } from '@/constants/placeholderData'

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
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
          Shop <span className="text-gradient-gold">All</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/60">
          Khám phá toàn bộ sản phẩm — tìm kiếm, lọc theo danh mục và thời gian.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-2 block font-mono text-[11px] font-medium tracking-widest text-white/55 uppercase">
              Tìm kiếm
            </label>
            <input
              type="search"
              placeholder="Tên sản phẩm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[11px] font-medium tracking-widest text-white/55 uppercase">
              Danh mục
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                setPage(1)
              }}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]"
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
            <label className="mb-2 block font-mono text-[11px] font-medium tracking-widest text-white/55 uppercase">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(1)
              }}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[11px] font-medium tracking-widest text-white/55 uppercase">
              Đến ngày
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(1)
              }}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] px-4 text-sm font-semibold tracking-wider text-white shadow-[0_0_20px_-10px_rgba(234,88,12,0.55)] transition hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.65)]"
            >
              Áp dụng
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-white"
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
          <p className="mb-6 font-mono text-xs tracking-widest text-white/45 uppercase">
            Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total} sản phẩm
          </p>
          <ProductGrid products={products} buyNowLabel="Thêm vào giỏ" columns={4} variant="dark" />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Phân trang">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>
              <span className="px-4 py-2 font-mono text-xs tracking-widest text-white/55 uppercase">
                Trang {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
