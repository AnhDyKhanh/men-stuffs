import { getProductById } from '@/app/_hooks/getProductById'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ProductForm from './_component/ProductForm' // Import component vừa tạo
import Rating from './_component/Rating'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Breadcrumb nhỏ */}
        <nav className="mb-8 text-[10px] tracking-[0.2em] text-gray-500 uppercase">
          Home / Products / {product.name}
        </nav>

        <div className="grid gap-12 md:grid-cols-12">
          {/* Cột trái: Ảnh sản phẩm (Chiếm 7/12 cột) */}
          <div className="flex gap-4 md:col-span-7">
            {/* Danh sách ảnh nhỏ bên cạnh (Thumbnails) */}
            <div className="hidden w-20 flex-col gap-2 md:flex">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square cursor-pointer border border-zinc-800 bg-zinc-900">
                  <Image
                    src={product.thumbnail}
                    alt="thumb"
                    width={80}
                    height={80}
                    className="h-full object-cover opacity-50 hover:opacity-100"
                  />
                </div>
              ))}
            </div>

            {/* Ảnh chính */}
            <div className="group flex flex-1 cursor-zoom-in items-center justify-center overflow-hidden bg-zinc-900">
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={800}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-125"
              />
            </div>
          </div>

          {/* Cột phải: Thông tin */}
          <div className="sticky top-24 flex h-fit flex-col pt-4 md:col-span-5">
            <p className="mb-2 text-[10px] tracking-widest text-gray-500 uppercase">Men Stuff</p>
            <h1 className="mb-2 text-3xl font-medium tracking-tight">{product.name}</h1>
            {/* Thêm phần đánh giá ở đây */}
            <Rating score={5} reviews={36} />

            <p className="mb-8 text-xl font-light">{product.price.toLocaleString('vi-VN')} VND</p>

            <ProductForm product={product} />

            <div className="mt-10 border-t border-zinc-800 pt-10">
              <p className="text-sm leading-relaxed text-zinc-400 italic">
                Different isn&apos;t abnormal — it&apos;s powerful. Men Stuff stands with you. Own it.
              </p>
            </div>
          </div>
        </div>

        {/* Phần mô tả chi tiết dưới cùng */}
        <div className="mt-20 border-t border-zinc-800 pt-16">
          <div className="max-w-3xl">
            <h2 className="mb-8 w-fit border-b border-white pb-2 text-xl tracking-widest uppercase">Description</h2>
            <div className="space-y-6 leading-loose text-zinc-400">
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
