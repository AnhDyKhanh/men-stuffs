import { getProductById } from '@/app/_hooks/getProductById';
import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n'
import Image from 'next/image';
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { lang, id } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-200 h-96 rounded-lg">
          <Image src={product.thumbnail} alt={product.name} width={300} height={300} className='w-full h-full object-cover' />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4 text-amber-100">{product.name}</h1>
          <p className="text-3xl font-bold mb-6">${product.price}</p>
          <p className="text-gray-600 mb-8">{product.description}</p>

          <div className="flex gap-4">
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition flex-1">
              {dict.products.addToCart}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
