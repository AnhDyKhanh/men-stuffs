import Link from 'next/link'
import ProductForm from '@/app/[lang]/_components/admin/ProductForm'
import { labels, BASE_PATH } from '@/lib/labels'

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  await params
  const dict = labels.admin

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{dict.createProduct}</h1>
        <Link
          href={`${BASE_PATH}/products-management`}
          className="text-gray-600 hover:text-black"
        >
          ← {dict.backToProducts}
        </Link>
      </div>

      <div className="bg-white border rounded-lg p-8 max-w-2xl shadow-sm">
        <ProductForm
          lang="vi"
          translations={{
            productName: dict.productName,
            productNameVi: dict.productNameVi,
            productNameEn: dict.productNameEn,
            productPrice: dict.productPrice,
            productStatus: dict.status,
            active: dict.active,
            inactive: dict.inactive,
            save: dict.save,
            cancel: dict.cancel,
          }}
        />
      </div>
    </div>
  )
}
