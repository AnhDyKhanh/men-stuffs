'use client'

import { useGetAllProducts } from '@/app/_hooks/getAllProductsMutation'
import DashboardQuickActions from './DashboardQuickActions'

function formatRevenue(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  )
}

export default function DashboardDashboardClient({
  labels: adminLabels,
}: {
  labels: typeof import('@/lib/labels').labels.admin
}) {
  const { data: products } = useGetAllProducts({
    page: 1,
    size: 10,
    orderBy: 'created_at',
  })

  const stats = {
    totalProducts: products?.data?.length || 0,
    totalOrders: 150,
    totalRevenue: 12500000,
    pendingOrders: 5,
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">{adminLabels.dashboard}</h1>

      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Thống kê">
        <StatCard title={adminLabels.totalProducts} value={stats.totalProducts} />
        <StatCard title={adminLabels.totalOrders} value={stats.totalOrders} />
        <StatCard title={adminLabels.totalRevenue} value={formatRevenue(stats.totalRevenue)} />
        <StatCard title={adminLabels.pendingOrders} value={stats.pendingOrders} />
      </section>

      <DashboardQuickActions
        locale="vi"
        createProductLabel={adminLabels.createProduct}
        productsLabel={adminLabels.products}
        quickActionsLabel={adminLabels.quickActions}
      />
    </div>
  )
}
