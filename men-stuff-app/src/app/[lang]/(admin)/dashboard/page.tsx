import { getDictionary, isValidLocale } from '@/lib/i18n'
import { getAllProductsMutation } from '@/app/_hooks/getAllProductsMutation'
import Link from 'next/link'

type PageProps = {
  params: Promise<{
    lang: string
  }>
}

const CURRENCY_OPTIONS = {
  vi: { locale: 'vi-VN' as const, currency: 'VND' },
  en: { locale: 'en-US' as const, currency: 'VND' },
} as const

function formatRevenue(value: number, locale: 'vi' | 'en') {
  const { locale: l, currency } = CURRENCY_OPTIONS[locale]
  return new Intl.NumberFormat(l, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
}

function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-gray-600 mb-2 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

export default async function AdminDashboardPage({ params }: PageProps) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)

  //cái này chỉ trả thuần data, ko có destructuring được 
  const { data: products, error, message, status } = await getAllProductsMutation()
  // const activeProducts = products.filter((p) => p.status === 'active').length
  // const inactiveProducts = products.filter(
  //   (p) => p.status === 'inactive',
  // ).length

  const stats = {
    totalProducts: products?.length || 0,
    // activeProducts, //check sau    // inactiveProducts,
    totalOrders: 150, //check sau  
    totalRevenue: 12500000,
    pendingOrders: 5,
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {dict.admin.dashboard}
      </h1>

      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        aria-label="Statistics"
      >
        <StatCard
          title={dict.admin.totalProducts}
          value={stats.totalProducts}
        //check sau
        // subtitle={`${stats.activeProducts} ${dict.admin.active}, ${stats.inactiveProducts} ${dict.admin.inactive}`}
        />
        <StatCard title={dict.admin.totalOrders} value={stats.totalOrders} />
        <StatCard
          title={dict.admin.totalRevenue}
          value={formatRevenue(stats.totalRevenue, locale)}
        />
        <StatCard
          title={dict.admin.pendingOrders}
          value={stats.pendingOrders}
        />
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {dict.admin.quickActions}
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/${locale}/products-management/new`}
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            {dict.admin.createProduct}
          </Link>
          <Link
            href={`/${locale}/products-management`}
            className="inline-flex items-center justify-center bg-gray-200 text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            {dict.admin.products}
          </Link>
        </div>
      </section>
    </div>
  )
}
