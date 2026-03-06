import { getProductById } from '@/app/_hooks/getProductById'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ProductForm from './_component/ProductForm' // Import component vừa tạo
import Rating from './_component/Rating'

type PageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Breadcrumb nhỏ */}
        <nav className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-8">
          Home  /  Products  /  {product.name}
        </nav>

        <div className="grid md:grid-cols-12 gap-12">

          {/* Cột trái: Ảnh sản phẩm (Chiếm 7/12 cột) */}
          <div className="md:col-span-7 flex gap-4">
            {/* Danh sách ảnh nhỏ bên cạnh (Thumbnails) */}
            <div className="hidden md:flex flex-col gap-2 w-20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <Image src={product.thumbnail} alt="thumb" width={80} height={80} className="opacity-50 hover:opacity-100 object-cover h-full" />
                </div>
              ))}
            </div>

            {/* Ảnh chính */}
            <div className="flex-1 bg-zinc-900 flex items-center justify-center overflow-hidden cursor-zoom-in group">
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={800}
                height={800}
                className="object-cover w-full h-auto transition-transform duration-700 ease-in-out group-hover:scale-125"
              />
            </div>
          </div>

          {/* Cột phải: Thông tin */}
          <div className="md:col-span-5 flex flex-col pt-4 sticky top-24 h-fit">
            <p className="text-gray-500 text-[10px] tracking-widest uppercase mb-2">Men Stuff</p>
            <h1 className="text-3xl font-medium mb-2 tracking-tight">
              {product.name}
            </h1>
            {/* Thêm phần đánh giá ở đây */}
            <Rating score={5} reviews={36} />

            <p className="text-xl font-light mb-8">
              {product.price.toLocaleString("vi-VN")} VND
            </p>




            <ProductForm />

            <div className="mt-10 pt-10 border-t border-zinc-800">
              <p className="text-sm leading-relaxed text-zinc-400 italic">
                Different isn&apos;t abnormal — it&apos;s powerful. Men Stuff stands with you. Own it.
              </p>
            </div>
          </div>
        </div>

        {/* Phần mô tả chi tiết dưới cùng */}
        <div className="mt-20 border-t border-zinc-800 pt-16">
          <div className="max-w-3xl">
            <h2 className="text-xl uppercase tracking-widest mb-8 border-b border-white w-fit pb-2">Description</h2>
            <div className="space-y-6 text-zinc-400 leading-loose">
              <p>{product.description}</p>
              <p><strong>Material:</strong> 925 Sterling Silver, Black Onyx Gemstone.</p>
              <p><strong>Craftsmanship:</strong> Hand-finished by master artisans with intricate floral carvings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}