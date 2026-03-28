import { getAllProducts } from '@/app/api/admin/products/services/getAllProducts';

function formatRevenue(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-10 shadow-md">
      <h3 className="mb-4 text-base font-medium text-gray-600">{title}</h3>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}

export default async function DashboardDashboardClient() {
  const result = await getAllProducts({
    page: 1,
    size: 100,
    orderBy: 'created_at',
    ascending: false,
  })
  const totalProducts = result?.total ?? 0

  return (
    <div>
      <h1 className="mb-10 text-4xl font-bold text-gray-900">Thông tin chung</h1>

      <section className="mb-8 grid grid-cols-2 gap-8" aria-label="Thống kê">
        <StatCard title="Tổng sản phẩm" value={totalProducts} />
        <StatCard title="Tổng đơn hàng" value={'150'} />
        <StatCard title="Tổng doanh thu" value={formatRevenue(12500000)} />
        <StatCard title="Đơn hàng chờ xử lý" value={'5'} />
      </section>
    </div>
  )
}