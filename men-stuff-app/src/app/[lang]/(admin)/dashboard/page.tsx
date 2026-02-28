import { getDictionary, isValidLocale } from '@/lib/i18n'
import { getAllProductsMutation } from '@/app/_hooks/getAllProductsMutation'
import DashboardQuickActions from './_components/DashboardQuickActions'

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

  const { data: products } = await getAllProductsMutation()

  const stats = {
    totalProducts: products?.length || 0,
    totalOrders: 150,
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

      <DashboardQuickActions
        locale={locale}
        createProductLabel={dict.admin.createProduct}
        productsLabel={dict.admin.products}
        quickActionsLabel={dict.admin.quickActions}
      />
    </div>
  )
}
