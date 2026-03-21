'use client'

import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
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
    <div className="rounded-xl border border-border bg-card/80 p-6 shadow-[0_0_40px_-18px_rgba(247,147,26,0.12)] backdrop-blur">
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export default function DashboardDashboardClient() {
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
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        <span className="text-gradient-gold">Bảng điều khiển</span>
      </h1>

      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Thống kê">
        <StatCard title="Tổng sản phẩm" value={stats.totalProducts} />
        <StatCard title="Tổng đơn hàng" value={stats.totalOrders} />
        <StatCard title="Tổng doanh thu" value={formatRevenue(stats.totalRevenue)} />
        <StatCard title="Đơn hàng chờ xử lý" value={stats.pendingOrders} />
      </section>

      <DashboardQuickActions
        locale="vi"
        createProductLabel="Tạo sản phẩm mới"
        productsLabel="Quản lý sản phẩm"
        quickActionsLabel="Thao tác nhanh"
      />
    </div>
  )
}
