'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BASE_PATH, labels } from '@/lib/labels'
import ProductGrid from '@/app/(store)/_components/ProductGrid'
import { useGetAllProducts } from '@/app/_hooks/getAllProductsMutation'
import { useGetAllCategories } from '@/app/_hooks/useGetAllCategories'
import type { Product } from '@/app/_models/product'
import type { PlaceholderProduct } from '@/app/_constants/placeholderData'

type CategoryItem = { id: string; name?: string | null }

const LOCALE_VI = 'vi-VN'
const PAGE_SIZE = 20

function formatPrice(value: number): string {
  return new Intl.NumberFormat(LOCALE_VI, {
    style: 'currency',
    currency: 'VND',
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
    href: `${basePath}/product/${p.slug || p.id}`,
    rating: 0,
    reviewCount: 0,
    label: 'new' as const,
  }))
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i)
  }
  const pages: (number | 'ellipsis')[] = []
  if (currentPage <= 3) {
    for (let i = 0; i < 5; i++) pages.push(i)
    pages.push('ellipsis')
    pages.push(totalPages - 1)
  } else if (currentPage >= totalPages - 4) {
    pages.push(0)
    pages.push('ellipsis')
    for (let i = totalPages - 5; i < totalPages; i++) pages.push(i)
  } else {
    pages.push(0)
    pages.push('ellipsis')
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
    pages.push('ellipsis')
    pages.push(totalPages - 1)
  }
  return pages
}

type ViewMode = 'shop-all' | 'new-in'

type ProductsPageClientProps = {
  view?: ViewMode
  initialPage?: number
  initialCategoryId?: string
  initialSearch?: string
}

export default function ProductsPageClient({
  view = 'shop-all',
  initialPage = 0,
  initialCategoryId,
  initialSearch: initialSearchProp,
}: ProductsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [page, setPage] = useState(initialPage)
  const [categoryId, setCategoryId] = useState<string | undefined>(initialCategoryId)
  const [searchInput, setSearchInput] = useState(initialSearchProp ?? '')
  const [searchApplied, setSearchApplied] = useState(initialSearchProp ?? '')

  const { data: categoriesData } = useGetAllCategories()
  const categories: CategoryItem[] = Array.isArray(categoriesData)
    ? (categoriesData as CategoryItem[])
    : ((categoriesData as unknown as { data?: CategoryItem[] })?.data ?? [])

  useEffect(() => {
    setPage(initialPage)
  }, [initialPage])
  useEffect(() => {
    setCategoryId(initialCategoryId)
  }, [initialCategoryId])
  useEffect(() => {
    setSearchInput(initialSearchProp ?? '')
    setSearchApplied(initialSearchProp ?? '')
  }, [initialSearchProp])

  const updateUrl = useCallback(
    (opts: { page?: number; categoryId?: string | null; search?: string | null }) => {
      const params = new URLSearchParams(searchParams?.toString() ?? '')
      if (view === 'new-in') params.set('view', 'new-in')
      if (opts.page !== undefined) {
        if (opts.page > 0) params.set('page', String(opts.page))
        else params.delete('page')
      }
      if (opts.categoryId !== undefined) {
        if (opts.categoryId) params.set('category', opts.categoryId)
        else params.delete('category')
      }
      if (opts.search !== undefined) {
        if (opts.search) params.set('q', opts.search)
        else params.delete('q')
      }
      const q = params.toString()
      const url = `${BASE_PATH}/products${q ? `?${q}` : ''}`
      router.replace(url, { scroll: false })
    },
    [view, searchParams, router],
  )

  const applySearch = useCallback(() => {
    const q = searchInput.trim() || undefined
    setSearchApplied(q ?? '')
    setPage(0)
    updateUrl({ page: 0, search: q ?? null })
  }, [searchInput, updateUrl])

  const clearFilters = useCallback(() => {
    setCategoryId(undefined)
    setSearchInput('')
    setSearchApplied('')
    setPage(0)
    updateUrl({ page: 0, categoryId: null, search: null })
  }, [updateUrl])

  const hasActiveFilters = Boolean(categoryId || searchApplied)

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetAllProducts({
    page,
    size: PAGE_SIZE,
    orderBy: 'created_at',
    ascending: false,
    categoryId: categoryId || undefined,
    search: searchApplied || undefined,
  })

  const products = response?.data ?? null
  const total = response?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const placeholderProducts = mapProductsToPlaceholder(products, BASE_PATH)

  const goToPage = useCallback(
    (p: number) => {
      const next = Math.max(0, Math.min(p, totalPages - 1))
      setPage(next)
      updateUrl({ page: next })
    },
    [totalPages, updateUrl],
  )

  const handleCategoryChange = useCallback(
    (id: string | undefined) => {
      setCategoryId(id)
      setPage(0)
      updateUrl({ page: 0, categoryId: id ?? null })
    },
    [updateUrl],
  )

  const title = view === 'new-in' ? 'New In' : labels.products.allProducts
  const subtitle = view === 'new-in' ? 'Sản phẩm mới nhất vừa về' : 'Khám phá toàn bộ sản phẩm của chúng tôi'

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title} <span className="text-gradient-gold">{view === 'new-in' ? 'Drop' : ''}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/60">{subtitle}</p>
          {total > 0 && (
            <p className="mt-3 font-mono text-xs tracking-widest text-white/45 uppercase">{total} sản phẩm</p>
          )}
        </header>

        {/* Filter & Search */}
        <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] font-medium tracking-widest text-white/55 uppercase">
              Danh mục
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange(undefined)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${!categoryId
                    ? 'border-[#F7931A]/60 bg-[#F7931A]/15 text-white shadow-[0_0_18px_-12px_rgba(247,147,26,0.6)]'
                    : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/8 hover:text-white'
                  }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${categoryId === cat.id
                      ? 'border-[#F7931A]/60 bg-[#F7931A]/15 text-white shadow-[0_0_18px_-12px_rgba(247,147,26,0.6)]'
                      : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/8 hover:text-white'
                    }`}
                >
                  {cat.name ?? cat.id}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2 sm:max-w-xs sm:flex-initial">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              placeholder="Tìm sản phẩm..."
              className="h-12 w-full min-w-0 flex-1 rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A] sm:w-48"
              aria-label="Tìm sản phẩm"
            />
            <button
              type="button"
              onClick={applySearch}
              className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] px-5 text-sm font-semibold tracking-wider text-white shadow-[0_0_20px_-10px_rgba(234,88,12,0.55)] transition hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.65)]"
            >
              Tìm
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white/70 transition hover:bg-white/8 hover:text-white"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && placeholderProducts.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-lg border border-red-500/50 bg-red-950/30 p-4 text-red-200">
            <p className="font-medium">Không tải được danh sách sản phẩm.</p>
            <p className="mt-1 text-sm">{error?.message ?? 'Vui lòng thử lại sau.'}</p>
          </div>
        )}

        {/* Grid */}
        {!isError && (placeholderProducts.length > 0 || !isLoading) && (
          <>
            <ProductGrid
              products={placeholderProducts}
              buyNowLabel={labels.products.addToCart}
              columns={4}
              variant="dark"
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 0}
                  className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                >
                  Trước
                </button>
                <div className="flex items-center gap-1">
                  {getPageNumbers(page, totalPages).map((n, i) =>
                    n === 'ellipsis' ? (
                      <span key={`ellipsis-${i}`} className="px-2 font-mono text-xs tracking-widest text-white/35">
                        …
                      </span>
                    ) : (
                      <button
                        key={n}
                        type="button"
                        onClick={() => goToPage(n)}
                        className={`inline-flex h-11 min-w-10 items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${n === page
                            ? 'border-[#F7931A]/60 bg-[#F7931A]/15 text-white shadow-[0_0_18px_-12px_rgba(247,147,26,0.6)]'
                            : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/8 hover:text-white'
                          }`}
                      >
                        {n + 1}
                      </button>
                    ),
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                >
                  Sau
                </button>
              </nav>
            )}
          </>
        )}

        {/* Empty */}
        {!isLoading && !isError && placeholderProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/60">Chưa có sản phẩm nào.</p>
          </div>
        )}
      </div>
    </div>
  )
}
