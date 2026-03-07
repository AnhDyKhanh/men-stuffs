'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BASE_PATH, labels } from '@/lib/labels'
import ProductGrid from '@/components/store/ProductGrid'
import { useGetAllProducts } from '@/app/_hooks/getAllProductsMutation'
import { useGetAllCategories } from '@/app/_hooks/useGetAllCategories'
import type { Product } from '@/app/_models/product'
import type { PlaceholderProduct } from '@/app/_constants/placeholderData'

const LOCALE_VI = 'vi-VN'
const PAGE_SIZE = 20

function formatPrice(value: number): string {
  return new Intl.NumberFormat(LOCALE_VI, {
    style: 'currency',
    currency: 'VND',
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
    href: `${basePath}/products/${p.slug || p.id}`,
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
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as { data?: unknown[] })?.data ?? []

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
    [view, searchParams, router]
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
    [totalPages, updateUrl]
  )

  const handleCategoryChange = useCallback(
    (id: string | undefined) => {
      setCategoryId(id)
      setPage(0)
      updateUrl({ page: 0, categoryId: id ?? null })
    },
    [updateUrl]
  )

  const title = view === 'new-in' ? 'New In' : labels.products.allProducts
  const subtitle =
    view === 'new-in'
      ? 'Sản phẩm mới nhất vừa về'
      : 'Khám phá toàn bộ sản phẩm của chúng tôi'

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-base text-neutral-300">{subtitle}</p>
          {total > 0 && (
            <p className="mt-1 text-sm text-neutral-400">
              {total} {total === 1 ? 'sản phẩm' : 'sản phẩm'}
            </p>
          )}
        </header>

        {/* Filter & Search */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-neutral-400">Danh mục:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange(undefined)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  !categoryId
                    ? 'border-white bg-white text-black'
                    : 'border-neutral-600 text-white hover:bg-neutral-800'
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat: { id: string; name?: string | null }) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    categoryId === cat.id
                      ? 'border-white bg-white text-black'
                      : 'border-neutral-600 text-white hover:bg-neutral-800'
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
              className="w-full min-w-0 flex-1 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2 text-white placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:w-48"
              aria-label="Tìm sản phẩm"
            />
            <button
              type="button"
              onClick={applySearch}
              className="rounded-lg border border-neutral-600 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Tìm
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-neutral-600 px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
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
              <nav
                className="mt-14 flex flex-wrap items-center justify-center gap-2"
                aria-label="Phân trang"
              >
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 0}
                  className="inline-flex h-10 items-center rounded-lg border border-neutral-600 bg-transparent px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-50"
                >
                  Trước
                </button>
                <div className="flex items-center gap-1">
                  {getPageNumbers(page, totalPages).map((n, i) =>
                    n === 'ellipsis' ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-neutral-500">
                        …
                      </span>
                    ) : (
                      <button
                        key={n}
                        type="button"
                        onClick={() => goToPage(n)}
                        className={`inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border text-sm font-medium transition ${
                          n === page
                            ? 'border-white bg-white text-black'
                            : 'border-neutral-600 bg-transparent text-white hover:bg-neutral-800'
                        }`}
                      >
                        {n + 1}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="inline-flex h-10 items-center rounded-lg border border-neutral-600 bg-transparent px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-50"
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
            <p className="text-neutral-400">Chưa có sản phẩm nào.</p>
          </div>
        )}
      </div>
    </div>
  )
}
