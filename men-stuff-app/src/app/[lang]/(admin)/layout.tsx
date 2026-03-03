import Link from 'next/link'
import { cookies } from 'next/headers'
import { labels, BASE_PATH } from '@/lib/labels'
import { getUserRole } from '@/lib/auth'
import LogoutButton from '@/app/[lang]/_components/admin/LogoutButton'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  await params
  const cookieStore = await cookies()
  const userRole = getUserRole(cookieStore)

  if (userRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Truy cập bị từ chối</h1>
        <p className="text-gray-600 mb-4">
          Bạn cần đăng nhập với tài khoản admin.
        </p>
        <Link
          href={`${BASE_PATH}/login`}
          className="text-blue-600 hover:underline"
        >
          Đăng nhập Admin
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r min-h-screen">
        <div className="p-6">
          <Link
            href={`${BASE_PATH}/dashboard`}
            className="text-2xl font-bold text-blue-600"
          >
            Khu vực Admin
          </Link>
        </div>
        <nav className="px-4 space-y-2">
          <Link
            href={`${BASE_PATH}/dashboard`}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition"
          >
            {labels.admin.dashboard}
          </Link>
          <Link
            href={`${BASE_PATH}/products-management`}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition"
          >
            {labels.admin.products}
          </Link>
          <Link
            href={`${BASE_PATH}/categories-management`}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition"
          >
            {labels.admin.categories}
          </Link>
          <div className="pt-4 border-t">
            <LogoutButton lang="vi" />
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              Bảng điều khiển Admin
            </h1>
            <div className="flex items-center gap-4">
              <Link
                href={BASE_PATH}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {labels.admin.viewStore}
              </Link>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">
                admin@menstuff.local
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
