import { OrdersPageClient } from './_components/OrdersPageClient'

/**
 * Admin — Quản lý đơn hàng (nhận & cập nhật trạng thái).
 * Luồng: vào trang → bảng đơn mới nhất → lọc / tìm → đổi trạng thái (PATCH).
 */
export default function AdminOrdersPage() {
  return <OrdersPageClient />
}
