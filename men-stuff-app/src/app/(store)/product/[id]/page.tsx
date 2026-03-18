'use client'

import { useGetProductById } from '@/app/_hooks/getProductById'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import ProductForm from './_component/ProductForm'; // Import component vừa tạo
import Rating from './_component/Rating'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isLoading } = useGetProductById(id as string)
  console.log('product', product)

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Breadcrumb nhỏ */}
        <nav className="mb-8 font-mono text-[11px] tracking-widest text-white/55 uppercase">
          <span className="text-white/35">Home</span> <span className="text-white/25">/</span>{' '}
          <span className="text-white/35">Products</span> <span className="text-white/25">/</span>{' '}
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid gap-12 md:grid-cols-12">
          {/* Cột trái: Ảnh sản phẩm (Chiếm 7/12 cột) */}
          <div className="flex gap-4 md:col-span-7">
            {/* Danh sách ảnh nhỏ bên cạnh (Thumbnails) */}
            <div className="hidden w-20 flex-col gap-2 md:flex">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/30 transition hover:border-[#F7931A]/50 hover:shadow-[0_0_20px_-10px_rgba(247,147,26,0.45)]"
                >
                  <Image
                    src={product.thumbnail}
                    alt="thumb"
                    width={80}
                    height={80}
                    className="h-full object-cover opacity-60 transition hover:opacity-100"
                  />
                </div>
              ))}
            </div>

            {/* Ảnh chính */}
            <div className="group relative flex flex-1 cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-[0_0_60px_-18px_rgba(247,147,26,0.12)]">
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={800}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-125"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
            </div>
          </div>

          {/* Cột phải: Thông tin */}
          <div className="sticky top-24 flex h-fit flex-col pt-4 md:col-span-5">
            <p className="mb-2 font-mono text-[11px] tracking-widest text-white/45 uppercase">Men Stuffs</p>
            <h1 className="mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
            {/* Thêm phần đánh giá ở đây */}
            <Rating score={5} reviews={36} />

            <p className="mb-8 font-mono text-2xl font-semibold text-gradient-gold">
              {product.price.toLocaleString('vi-VN')} VND
            </p>

            <ProductForm product={product} />

            <div className="mt-10 border-t border-white/10 pt-10">
              <p className="text-sm leading-relaxed text-white/55 italic">
                Different isn&apos;t abnormal — it&apos;s powerful. Men Stuff stands with you. Own it.
              </p>
            </div>
          </div>
        </div>

        {/* Phần mô tả chi tiết dưới cùng */}
        <div className="mt-20 border-t border-white/10 pt-14">
          <div className="max-w-3xl">
            <h2 className="mb-8 w-fit border-b border-[#F7931A]/50 pb-2 font-mono text-sm tracking-widest text-white uppercase">
              Description
            </h2>
            <div className="space-y-6 leading-loose text-white/60">
              <p>{product.description}</p>
              <p>
                <strong>Material:</strong> 925 Sterling Silver, Black Onyx Gemstone.
              </p>
              <p>
                <strong>Craftsmanship:</strong> Hand-finished by master artisans with intricate floral carvings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
