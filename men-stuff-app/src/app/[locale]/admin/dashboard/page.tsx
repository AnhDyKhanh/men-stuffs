import { useTranslations } from '@/lib/i18n';
import Link from 'next/link';
import { getAllProducts } from '@/lib/mock-products';

/**
 * Admin dashboard page
 */
export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');
  
  // Get real product stats from mock data
  const products = getAllProducts();
  const activeProducts = products.filter((p) => p.status === 'active').length;
  const inactiveProducts = products.filter((p) => p.status === 'inactive').length;

  // Mock stats for other metrics
  const stats = {
    totalProducts: products.length,
    activeProducts,
    inactiveProducts,
    totalOrders: 150,
    totalRevenue: 12500000,
    pendingOrders: 5,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('admin.dashboard')}</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 mb-2 text-sm">{t('admin.totalProducts')}</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.activeProducts} {t('admin.active')}, {stats.inactiveProducts} {t('admin.inactive')}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 mb-2 text-sm">{t('admin.totalOrders')}</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 mb-2 text-sm">{t('admin.totalRevenue')}</h3>
          <p className="text-3xl font-bold">
            {new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
              style: 'currency',
              currency: 'VND',
            }).format(stats.totalRevenue)}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 mb-2 text-sm">{t('admin.pendingOrders')}</h3>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{t('admin.quickActions')}</h2>
        <div className="flex gap-4">
          <Link
            href={`/${locale}/admin/products/new`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t('admin.createProduct')}
          </Link>
          <Link
            href={`/${locale}/admin/products`}
            className="bg-gray-200 text-black px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            {t('admin.products')}
          </Link>
        </div>
      </div>
    </div>
  );
}

