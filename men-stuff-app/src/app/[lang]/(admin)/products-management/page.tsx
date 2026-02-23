import { getDictionary, isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { getProductName } from '@/lib/mock-products'
import { Product, ProductStatus } from '@/app/_types/product'
import DeleteProductButton from '@/app/[lang]/_components/admin/DeleteProductButton'
import { API_ROUTES } from '@/app/_constants/apiRouter'
import { getBaseUrl } from '@/lib/utils'

/** Normalize API/Supabase product to Product shape (camelCase + required fields) */
function normalizeProduct(p: Record<string, unknown>): Product {
  return {
    id: String(p.id ?? ''),
    category_id: String(p.category_id ?? ''),
    name_vi: String(p.name_vi ?? ''),
    name_en: String(p.name_en ?? ''),
    price: Number(p.price ?? 0),
    thumbnail: String(p.thumbnail ?? ''),
    status: p.status as ProductStatus,
    createdAt: String(p.createdAt ?? p.created_at ?? ''),
  }
}

interface PageProps {
  params: Promise<{ lang: string }>
}

/**
 * Admin products list page - CRUD interface (data from GET /api/admin/products)
 */
export default async function AdminProductsPage({ params }: PageProps) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)

  const res = await fetch(`${getBaseUrl()}${API_ROUTES.PRODUCTS.GET_ALL}`, {
    cache: 'no-store',
  })
  console.log(res)
  const raw = await res.json()
  const products = Array.isArray(raw)
    ? raw.map(normalizeProduct)
    : []
  const error = !Array.isArray(raw) && raw?.error ? String(raw.error) : null

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{dict.admin.products}</h1>
        <Link
          href={`/${locale}/products-management/new`}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {dict.admin.createProduct}
        </Link>
      </div>

      {/* Products Table */}
      {products.length > 0 ? (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dict.admin.productName}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dict.admin.productPrice}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dict.admin.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dict.admin.createdAt}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dict.admin.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getProductName(product, locale)}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {product.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat(
                      locale === 'vi' ? 'vi-VN' : 'en-US',
                      {
                        style: 'currency',
                        currency: 'VND',
                      },
                    ).format(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {product.status === 'active'
                        ? dict.admin.active
                        : dict.admin.inactive}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString(
                      locale === 'vi' ? 'vi-VN' : 'en-US',
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <Link
                        href={`/${locale}/products-management/${product.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {dict.admin.editProduct}
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        lang={locale}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
          <p className="text-gray-600 mb-4">{dict.admin.noProducts}</p>
          <Link
            href={`/${locale}/products-management/new`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {dict.admin.createProduct}
          </Link>
        </div>
      )}
    </div>
  )
}
