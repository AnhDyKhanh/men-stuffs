import { TasksPageClient } from './_components/TasksPageClient'

/**
 * Admin — Quản lý công việc (xem việc được giao, lọc, cập nhật trạng thái).
 * Luồng: vào trang → bảng task → lọc / tìm / “Việc của tôi” → đổi trạng thái (PATCH).
 */
export default function AdminTaskManagementPage() {
  return <TasksPageClient />
}
