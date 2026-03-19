'use client'

import { useGetProductById } from '@/app/_hooks/getProductById'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { notFound, useParams } from 'next/navigation'
import ProductForm from './_component/ProductForm'
import Rating from './_component/Rating'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isLoading, isError } = useGetProductById(id as string)

  // 1. Loading State với Skeleton cực mượt
  if (isLoading) return <ProductDetailSkeleton />

  // 2. Error hoặc không có sản phẩm
  if (isError || !product) notFound()

  return (
    <div className="min-h-screen text-white font-sans">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Breadcrumb dùng Shadcn UI */}
        <Breadcrumb className="mb-8 font-mono text-[11px] tracking-widest uppercase">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-white/35 hover:text-white transition-colors">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/20" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products" className="text-white/35 hover:text-white transition-colors">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/20" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-12 md:grid-cols-12">
          {/* CỘT TRÁI: GALLERY */}
          <div className="flex gap-4 md:col-span-7">
            {/* Ảnh chính - Dùng token bg-void-texture để đồng bộ */}
            <div className="group relative flex flex-1 cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-card/25 shadow-[0_0_60px_-18px_rgba(247,147,26,0.12)]">
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={800}
                height={800}
                priority
                className="h-auto w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* CỘT PHẢI: INFO */}
          <div className="sticky top-24 flex h-fit flex-col pt-4 md:col-span-5">
            <span className="mb-2 font-mono text-[11px] tracking-widest text-white/45 uppercase">Men Stuffs</span>
            <h1 className="mb-3 text-3xl font-semibold tracking-tight sm:text-4xl text-zinc-100">{product.name}</h1>

            <Rating score={5} reviews={36} />

            <p className="mt-4 mb-8 font-mono text-2xl font-semibold text-gradient-gold">
              {formatPrice(product.price)}
            </p>

            <ProductForm product={product} />

            {/* <Separator className="mt-10 mb-10 bg-white/10" /> */}

            <div className="mt-20 border-t border-white/10 pt-14">
              <div className="max-w-3xl">
                <h2 className="mb-8 w-fit border-b border-[#F7931A]/50 pb-2 font-mono text-sm tracking-widest text-white uppercase">
                  Description
                </h2>
                <div className="space-y-6 leading-loose text-zinc-400 text-sm">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-mono uppercase tracking-wider">
                    <div className="p-4 rounded-lg border border-white/5 bg-white/5">
                      <span className="block text-white/30 mb-1">Material</span>
                      <span className="text-white/80">925 Sterling Silver</span>
                    </div>
                    <div className="p-4 rounded-lg border border-white/5 bg-white/5">
                      <span className="block text-white/30 mb-1">Craftsmanship</span>
                      <span className="text-white/80">Hand-finished Artisans</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/55 italic">
              Different isn&apos;t abnormal — it&apos;s powerful. Men Stuff stands with you. Own it.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Component Loading Skeleton để màn hình không bị giật lag khi fetch */
function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-void-texture p-10">
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-12">
        <div className="col-span-7 flex gap-4">
          <div className="w-20 space-y-2"><Skeleton className="h-20 w-full rounded-xl" /><Skeleton className="h-20 w-full rounded-xl" /></div>
          <Skeleton className="h-[500px] flex-1 rounded-2xl" />
        </div>
        <div className="col-span-5 space-y-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}