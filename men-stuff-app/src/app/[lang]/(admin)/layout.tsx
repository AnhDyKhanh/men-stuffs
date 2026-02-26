import Link from 'next/link'
import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n'
import { cookies } from 'next/headers'
import { getUserRole } from '@/lib/auth'
import LogoutButton from '@/app/[lang]/_components/admin/LogoutButton'

/**
 * Admin layout - internal dashboard UI
 * Separate from store layout for clean architecture
 * Features sidebar navigation
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)
  const cookieStore = await cookies()
  const userRole = getUserRole(cookieStore)

  // This should be protected by middleware, but double-check
  if (userRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You must be an admin to access this area.
        </p>
        <Link
          href={`/${locale}/login`}
          className="text-blue-600 hover:underline"
        >
          Login as Admin
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen">
        <div className="p-6">
          <Link
            href={`/${locale}/dashboard`}
            className="text-2xl font-bold text-blue-600"
          >
            Admin Panel
          </Link>
        </div>
        <nav className="px-4 space-y-2">
          <Link
            href={`/${locale}/dashboard`}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition"
          >
            {dict.admin.dashboard}
          </Link>
          <Link
            href={`/${locale}/products-management`}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition"
          >
            {dict.admin.products}
          </Link>
          <Link
            href={`/${locale}/categories-management`}
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition"
          >
            {dict.admin.categories}
          </Link>
          <div className="pt-4 border-t">
            <LogoutButton lang={locale} />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {dict.admin.viewStore}
              </Link>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">
                admin@menstuff.local
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
