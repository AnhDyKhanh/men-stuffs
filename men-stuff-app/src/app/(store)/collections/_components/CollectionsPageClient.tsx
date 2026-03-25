'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { BASE_PATH } from '@/lib/labels'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import type { Product } from '@/models/product'

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

/** 4 sản phẩm mới nhất — cùng sort API (created_at desc). */
function comboNewInStack(products: Product[]): Product[] {
  return products.slice(0, 4)
}

/** Từ rẻ → cao: lấy 4 mức giá (min + quartiles + max) để combo “tổng hợp”. */
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

export default function CollectionsPageClient() {
  const { data, isLoading, isError } = useGetAllProducts({
    page: 1,
    size: 80,
    orderBy: 'created_at',
    ascending: false,
  })

  const products = (data?.data ?? []) as Product[]

  const comboA = useMemo(() => comboNewInStack(products), [products])
  const comboB = useMemo(() => comboPriceSpectrum(products), [products])

  const totalA = useMemo(() => comboA.reduce((s, p) => s + effectivePrice(p), 0), [comboA])
  const totalB = useMemo(() => comboB.reduce((s, p) => s + effectivePrice(p), 0), [comboB])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="mb-10 text-center sm:mb-14">
        <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">Men Stuffs</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Our <span className="text-gradient-gold">Collections</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60">
          Hai bộ sưu tập ghép từ sản phẩm thật trên cửa hàng — giá theo từng món và tổng combo.
        </p>
        <Separator className="mx-auto mt-10 max-w-md bg-white/10" />
      </header>

      {isLoading && (
        <div className="space-y-8">
          <Skeleton className="h-[420px] w-full rounded-2xl border border-white/10 bg-white/5" />
          <Skeleton className="h-[420px] w-full rounded-2xl border border-white/10 bg-white/5" />
        </div>
      )}

      {isError && (
        <p className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-center text-sm text-red-200">
          Không tải được sản phẩm. Vui lòng thử lại sau hoặc vào{' '}
          <Link href={`${BASE_PATH}/products`} className="text-primary underline-offset-4 hover:underline">
            Tất cả sản phẩm
          </Link>
          .
        </p>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p className="py-16 text-center text-white/60">
          Chưa có sản phẩm để lên bộ sưu tập.{' '}
          <Link href={`${BASE_PATH}/products`} className="text-primary underline-offset-4 hover:underline">
            Quay lại shop
          </Link>
        </p>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className="space-y-12">
          {/* Combo 1 — New In stack */}
          <Card className="overflow-hidden border-white/10 bg-card/80 shadow-[0_0_50px_-18px_rgba(247,147,26,0.15)] backdrop-blur">
            <CardHeader className="border-b border-white/10 bg-black/25 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Badge className="mb-2 border border-[#F7931A]/40 bg-[#F7931A]/15 font-mono text-[10px] tracking-wider text-rose-100">
                    Combo từ cửa hàng
                  </Badge>
                  <CardTitle className="text-2xl text-white sm:text-3xl">New In — Stack 4 món</CardTitle>
                  <p className="mt-2 max-w-xl text-sm text-white/60">
                    Bốn sản phẩm mới nhất (theo thời gian tạo). Phối full set: nhẫn + đồ đi kèm trong cùng tông.
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
              <span className="font-mono text-[10px] tracking-widest text-white/45 uppercase">Gợi ý: New In</span>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] font-semibold text-primary-foreground shadow-glow-orange"
              >
                <Link href={`${BASE_PATH}/new-in`}>Xem New In</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Combo 2 — Price spectrum */}
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
                      Chọn 4 mức giá (min → cao) trên danh sách hiện có — để so sánh và mix phong cách trong một nhìn.
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
                    const labels = ['Mức thấp', 'Tầm trung', 'Cao cấp', 'Top giá']
                    return (
                      <div
                        key={p.id}
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                      >
                        <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-white/80">
                          {labels[i] ?? `#${i + 1}`}
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
                        <Button asChild variant="outline" size="sm" className="mt-3 w-full border-white/15 bg-white/5 text-white hover:bg-white/10">
                          <Link href={productHref(p)}>Chi tiết</Link>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-6 py-4">
                <span className="font-mono text-[10px] tracking-widest text-white/45 uppercase">Shop All</span>
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <Link href={`${BASE_PATH}/products`}>Xem tất cả</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
