'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BASE_PATH } from '@/lib/labels'
import { API_ROUTES } from '@/constants/apiRouter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useAuth } from '@/hooks/useAuth'
import RequireLoginDialog from '@/components/shared/RequireLoginDialog'
import type { Product } from '@/models/product'
import { toast } from 'sonner'

type CollectionFromApi = {
  id: string
  name: string
  description: string | null
  created_at: string
  products: Product[]
}

function formatVnd(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function effectivePrice(p: Product): number {
  const d = p.discount_price
  const base = p.price ?? 0
  if (d != null && d > 0 && d < base) return d
  return base
}

function productHref(p: Product): string {
  return `${BASE_PATH}/product/${p.slug || p.id}`
}

function comboNewInStack(products: Product[]): Product[] {
  return products.slice(0, 4)
}

function comboPriceSpectrum(products: Product[]): Product[] {
  const valid = products.filter((p) => effectivePrice(p) > 0)
  if (valid.length === 0) return []
  const sorted = [...valid].sort((a, b) => effectivePrice(a) - effectivePrice(b))
  const n = sorted.length
  if (n <= 4) return sorted
  const idx = [0, Math.floor(n * 0.33), Math.floor(n * 0.66), n - 1]
  const seen = new Set<string>()
  const out: Product[] = []
  for (const i of idx) {
    const p = sorted[i]
    if (p && !seen.has(p.id)) {
      seen.add(p.id)
      out.push(p)
    }
  }
  return out
}

async function fetchPublicCollections(): Promise<CollectionFromApi[]> {
  const res = await fetch(API_ROUTES.COLLECTIONS.PUBLIC, { cache: 'no-store' })
  const json = (await res.json()) as { data?: CollectionFromApi[] }
  return json.data ?? []
}

export default function CollectionsPageClient() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { mutateAsync: addToCart, isPending: addingToCart } = useAddToCart()
  const [showRequireLoginDialog, setShowRequireLoginDialog] = useState(false)

  const addProductToCart = async (product: Product) => {
    if (!isAuthenticated) {
      setShowRequireLoginDialog(true)
      return
    }
    const price = effectivePrice(product)
    await addToCart({
      productId: product.id,
      quantity: 1,
      priceAtTime: price,
    })
  }

  const addCollectionToCart = async (items: Product[]) => {
    if (items.length === 0) return
    if (!isAuthenticated) {
      setShowRequireLoginDialog(true)
      return
    }
    for (const item of items) {
      await addProductToCart(item)
    }
    toast.success('Đã thêm bộ sưu tập vào giỏ hàng')
    router.push(`${BASE_PATH}/cart`)
  }

  const { data: curated = [], isLoading: loadingCurated } = useQuery({
    queryKey: ['@public-collections'],
    queryFn: fetchPublicCollections,
  })

  const { data, isLoading: loadingProducts, isError } = useGetAllProducts({
    page: 1,
    size: 80,
    orderBy: 'created_at',
    ascending: false,
  })

  const products = useMemo(() => (data?.data ?? []) as Product[], [data])

  const comboA = useMemo(() => comboNewInStack(products), [products])
  const comboB = useMemo(() => comboPriceSpectrum(products), [products])

  const totalA = useMemo(() => comboA.reduce((s, p) => s + effectivePrice(p), 0), [comboA])
  const totalB = useMemo(() => comboB.reduce((s, p) => s + effectivePrice(p), 0), [comboB])

  const showFallback = curated.length === 0
  const loading = loadingCurated || (showFallback && loadingProducts)

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="mb-10 text-center sm:mb-14">
        <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">Men Stuffs</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          <span className="text-gradient-gold">Bộ sưu tập</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60">
          {curated.length > 0
            ? 'Các bộ do team biên tập — kèm giá từng món và tổng combo.'
            : 'Gợi ý combo từ sản phẩm trên cửa hàng. Khi team tạo bộ sưu tập trong admin, nội dung sẽ hiển thị ở đây.'}
        </p>
        <Separator className="mx-auto mt-10 max-w-md bg-white/10" />
      </header>

      {loading && (
        <div className="space-y-8">
          <Skeleton className="h-[420px] w-full rounded-2xl border border-white/10 bg-white/5" />
          <Skeleton className="h-[420px] w-full rounded-2xl border border-white/10 bg-white/5" />
        </div>
      )}

      {!loading && curated.length > 0 && (
        <div className="space-y-12">
          {curated.map((col) => {
            const items = col.products ?? []
            const total = items.reduce((s, p) => s + effectivePrice(p), 0)
            return (
              <Card
                key={col.id}
                className="overflow-hidden border-white/10 bg-card/80 shadow-[0_0_50px_-18px_rgba(247,147,26,0.15)] backdrop-blur"
              >
                <CardHeader className="border-b border-white/10 bg-black/25 p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <Badge className="mb-2 border border-[#F7931A]/40 bg-[#F7931A]/15 font-mono text-[10px] tracking-wider text-rose-100">
                        Biên tập
                      </Badge>
                      <CardTitle className="text-2xl text-white sm:text-3xl">{col.name}</CardTitle>
                      {col.description && (
                        <p className="mt-2 max-w-xl text-sm text-white/60">{col.description}</p>
                      )}
                    </div>
                    {items.length > 0 && (
                      <div className="text-left sm:text-right">
                        <p className="font-mono text-[11px] tracking-widest text-white/45 uppercase">Tổng combo</p>
                        <p className="text-2xl font-semibold text-gradient-gold">{formatVnd(total)}</p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  {items.length === 0 ? (
                    <p className="text-sm text-white/50">Chưa có sản phẩm trong bộ này.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {items.map((p, i) => {
                        const price = effectivePrice(p)
                        const tierLabels = ['#1', '#2', '#3', '#4']
                        return (
                          <div
                            key={p.id}
                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                          >
                            <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-white/80">
                              {tierLabels[i] ?? `#${i + 1}`}
                            </span>
                            <div className="relative mx-auto mb-3 aspect-square w-full max-w-[200px] overflow-hidden rounded-xl">
                              <Image
                                src={p.origin_image || 'https://placehold.co/400x400/0f1115/f7931a?text=MS'}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 25vw"
                                unoptimized
                              />
                            </div>
                            <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-white">{p.name}</p>
                            <p className="mt-2 font-mono text-lg font-semibold text-gradient-gold">{formatVnd(price)}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                              onClick={() => {
                                addProductToCart(p)
                                  .then(() => toast.success('Đã thêm sản phẩm vào giỏ hàng'))
                                  .catch(() => toast.error('Thêm vào giỏ thất bại'))
                              }}
                              disabled={addingToCart}
                            >
                              Thêm vào giỏ
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="mt-2 w-full text-white/70 hover:text-white">
                              <Link href={productHref(p)}>Chi tiết</Link>
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-6 py-4">
                  <span className="font-mono text-[10px] tracking-widest text-white/45 uppercase">Bộ sưu tập</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15"
                    onClick={() => {
                      addCollectionToCart(items).catch(() => toast.error('Không thể thêm bộ sưu tập lúc này'))
                    }}
                    disabled={addingToCart || items.length === 0}
                  >
                    Thêm cả bộ vào giỏ
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {!loading && showFallback && isError && (
        <p className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-center text-sm text-red-200">
          Không tải được sản phẩm. Vui lòng thử lại sau hoặc vào{' '}
          <Link href={`${BASE_PATH}/products`} className="text-primary underline-offset-4 hover:underline">
            Tất cả sản phẩm
          </Link>
          .
        </p>
      )}

      {!loading && showFallback && !isError && products.length === 0 && (
        <p className="py-16 text-center text-white/60">
          Chưa có sản phẩm để hiển thị bộ sưu tập.{' '}
          <Link href={`${BASE_PATH}/products`} className="text-primary underline-offset-4 hover:underline">
            Quay lại shop
          </Link>
        </p>
      )}

      {!loading && showFallback && !isError && products.length > 0 && (
        <div className="space-y-12">
          <p className="font-mono text-center text-[11px] tracking-widest text-white/45 uppercase">
            Gợi ý tự động (chưa có bộ do admin tạo)
          </p>
          <Card className="overflow-hidden border-white/10 bg-card/80 shadow-[0_0_50px_-18px_rgba(247,147,26,0.15)] backdrop-blur">
            <CardHeader className="border-b border-white/10 bg-black/25 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Badge className="mb-2 border border-[#F7931A]/40 bg-[#F7931A]/15 font-mono text-[10px] tracking-wider text-rose-100">
                    Combo tự động
                  </Badge>
                  <CardTitle className="text-2xl text-white sm:text-3xl">New In — Stack 4 món</CardTitle>
                  <p className="mt-2 max-w-xl text-sm text-white/60">
                    Bốn sản phẩm mới nhất (theo thời gian tạo). Phối full set cùng tông.
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-mono text-[11px] tracking-widest text-white/45 uppercase">Tổng combo</p>
                  <p className="text-2xl font-semibold text-gradient-gold">{formatVnd(totalA)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid gap-0 lg:grid-cols-12">
                <div className="relative aspect-[4/3] border-b border-white/10 lg:col-span-5 lg:border-r lg:border-b-0">
                  {comboA[0] && (
                    <Image
                      src={comboA[0].origin_image || 'https://placehold.co/800x600/0f1115/f7931a?text=New+In'}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      unoptimized
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-mono tracking-widest text-white/70 uppercase">Highlight</p>
                    <p className="line-clamp-2 text-lg font-semibold text-white">{comboA[0]?.name ?? '—'}</p>
                  </div>
                </div>
                <div className="grid gap-3 p-4 sm:p-6 lg:col-span-7">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {comboA.map((p) => {
                      const price = effectivePrice(p)
                      return (
                        <Link
                          key={p.id}
                          href={productHref(p)}
                          className="group flex gap-3 rounded-xl border border-white/10 bg-black/30 p-3 transition hover:border-[#F7931A]/40"
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={p.origin_image || 'https://placehold.co/160x160/0f1115/999?text=MS'}
                              alt=""
                              width={80}
                              height={80}
                              className="h-full w-full object-cover transition group-hover:scale-105"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-medium text-white">{p.name}</p>
                            <p className="mt-1 font-mono text-sm text-gradient-gold">{formatVnd(price)}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-6 py-4">
              <span className="font-mono text-[10px] tracking-widest text-white/45 uppercase">New In</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15"
                  onClick={() => {
                    addCollectionToCart(comboA).catch(() => toast.error('Không thể thêm bộ sưu tập lúc này'))
                  }}
                  disabled={addingToCart || comboA.length === 0}
                >
                  Thêm cả bộ vào giỏ
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] font-semibold text-primary-foreground shadow-glow-orange"
                >
                  <Link href={`${BASE_PATH}/new-in`}>Xem New In</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {comboB.length >= 2 && (
            <Card className="overflow-hidden border-white/10 bg-card/80 shadow-[0_0_50px_-18px_rgba(247,147,26,0.15)] backdrop-blur">
              <CardHeader className="border-b border-white/10 bg-black/25 p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <Badge className="mb-2 border border-white/20 bg-white/10 font-mono text-[10px] tracking-wider text-white">
                      Phổ giá
                    </Badge>
                    <CardTitle className="text-2xl text-white sm:text-3xl">Từ phổ thông đến cao cấp</CardTitle>
                    <p className="mt-2 max-w-xl text-sm text-white/60">
                      Bốn mức giá (thấp → cao) trên danh sách hiện có — để so sánh và mix phong cách.
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-[11px] tracking-widest text-white/45 uppercase">Tổng combo</p>
                    <p className="text-2xl font-semibold text-gradient-gold">{formatVnd(totalB)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {comboB.map((p, i) => {
                    const price = effectivePrice(p)
                    const tierLabels = ['Mức thấp', 'Tầm trung', 'Cao cấp', 'Top giá']
                    return (
                      <div
                        key={p.id}
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                      >
                        <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-white/80">
                          {tierLabels[i] ?? `#${i + 1}`}
                        </span>
                        <div className="relative mx-auto mb-3 aspect-square w-full max-w-[200px] overflow-hidden rounded-xl">
                          <Image
                            src={p.origin_image || 'https://placehold.co/400x400/0f1115/f7931a?text=MS'}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 25vw"
                            unoptimized
                          />
                        </div>
                        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-white">{p.name}</p>
                        <p className="mt-2 font-mono text-lg font-semibold text-gradient-gold">{formatVnd(price)}</p>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                        >
                          <Link href={productHref(p)}>Chi tiết</Link>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-6 py-4">
                <span className="font-mono text-[10px] tracking-widest text-white/45 uppercase">Shop All</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15"
                    onClick={() => {
                      addCollectionToCart(comboB).catch(() => toast.error('Không thể thêm bộ sưu tập lúc này'))
                    }}
                    disabled={addingToCart || comboB.length === 0}
                  >
                    Thêm cả bộ vào giỏ
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15"
                  >
                    <Link href={`${BASE_PATH}/products`}>Xem tất cả</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
      </div>
      <RequireLoginDialog
        showRequireLoginDialog={showRequireLoginDialog}
        onClose={() => setShowRequireLoginDialog(false)}
      />
    </>
  )
}
