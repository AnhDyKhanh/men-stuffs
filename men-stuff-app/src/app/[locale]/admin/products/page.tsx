import { useTranslations } from '@/lib/i18n';
import Link from 'next/link';
import { getAllProducts, getProductName } from '@/lib/mock-products';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

/**
 * Admin products list page - CRUD interface
 */
export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');
  const products = getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('admin.products')}</h1>
        <Link
          href={`/${locale}/admin/products/new`}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {t('admin.createProduct')}
        </Link>
      </div>

      {/* Products Table */}
      {products.length > 0 ? (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.productName')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.productPrice')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.createdAt')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getProductName(product, locale as 'vi' | 'en')}
                    </div>
                    <div className="text-xs text-gray-500">ID: {product.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status === 'active' ? t('admin.active') : t('admin.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <Link
                        href={`/${locale}/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {t('admin.editProduct')}
                      </Link>
                      <DeleteProductButton productId={product.id} locale={locale} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
          <p className="text-gray-600 mb-4">{t('admin.noProducts')}</p>
          <Link
            href={`/${locale}/admin/products/new`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t('admin.createProduct')}
          </Link>
        </div>
      )}
    </div>
  );
}

