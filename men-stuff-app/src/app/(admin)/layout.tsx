import Link from 'next/link'
import { cookies } from 'next/headers'
import { labels, BASE_PATH } from '@/lib/labels'
import { getAccountIdFromCookie, getUserRole } from '@/lib/auth'
import { isStaffByAccountId } from '@/lib/auth-server'
import LogoutButton from '@/components/shared/LogoutButton'
import AdminThemeApplier from './AdminThemeApplier'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userRole = getUserRole(cookieStore)
  const accountId = getAccountIdFromCookie(cookieStore)
  const staffOk = accountId ? await isStaffByAccountId(accountId) : false

  if (userRole !== 'admin' && !staffOk) {
    return (
      <div className="admin-theme container mx-auto px-4 py-12 text-center">
        <AdminThemeApplier />
        <h1 className="mb-4 text-2xl font-bold">Truy cập bị từ chối</h1>
        <p className="mb-4 text-gray-600">
          Bạn cần đăng nhập với tài khoản nhân sự (admin / manager / staff) trong hệ thống.
        </p>
        <Link href={`${BASE_PATH}/login`} className="text-blue-600 hover:underline">
          Đăng nhập Admin
        </Link>
      </div>
    )
  }

  return (
    <div className="admin-theme admin flex min-h-screen bg-background">
      <AdminThemeApplier />
      <aside className="min-h-screen w-64 border-r border-border bg-card">
        <div className="p-6">
          <Link href={`${BASE_PATH}/dashboard`} className="text-2xl font-bold text-blue-600">
            Khu vực Admin
          </Link>
        </div>
        <nav className="space-y-2 px-4">
          <Link
            href={`${BASE_PATH}/dashboard`}
            className="block rounded-lg px-4 py-3 text-foreground transition hover:bg-muted hover:text-blue-600"
          >
            {labels.admin.dashboard}
          </Link>
          <Link
            href={`${BASE_PATH}/products-management`}
            className="block rounded-lg px-4 py-3 text-foreground transition hover:bg-muted hover:text-blue-600"
          >
            {labels.admin.products}
          </Link>
          <Link
            href={`${BASE_PATH}/categories-management`}
            className="block rounded-lg px-4 py-3 text-foreground transition hover:bg-muted hover:text-blue-600"
          >
            {labels.admin.categories}
          </Link>
          <Link
            href={`${BASE_PATH}/collections-management`}
            className="block rounded-lg px-4 py-3 text-foreground transition hover:bg-muted hover:text-blue-600"
          >
            {labels.admin.collectionsManagement}
          </Link>
          <Link
            href={`${BASE_PATH}/order`}
            className="block rounded-lg px-4 py-3 text-foreground transition hover:bg-muted hover:text-blue-600"
          >
            {labels.admin.orders}
          </Link>
          <Link
            href={`${BASE_PATH}/task-management`}
            className="block rounded-lg px-4 py-3 text-foreground transition hover:bg-muted hover:text-blue-600"
          >
            {labels.admin.staffTasks}
          </Link>
          <div className="border-t pt-4">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Bảng điều khiển Admin</h1>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                {labels.admin.viewStore}
              </Link>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">admin@menstuff.local</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
