import { cookies } from 'next/headers'
import { getAccountIdFromCookie, getUserRole } from '@/lib/auth'
import AuthTestClient from './_components/AuthTestClient'

/**
 * Trang test bảo mật: kiểm chứng Custom Cookie Auth (account + staff).
 */
export default async function AuthTestPage() {
  const cookieStore = await cookies()
  const accountId = getAccountIdFromCookie(cookieStore)
  const role = getUserRole(cookieStore)

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Auth Test – Custom Cookie
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Xác nhận cookie account_id và role hoạt động: Middleware → Server Page → API Route
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Kiểm tra Server-side (cookie)
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Đọc cookie account_id và role từ next/headers
        </p>
        {accountId ? (
          <div className="mt-3 text-sm">
            <p>
              <span className="font-medium text-black">account_id:</span> <span className="text-black">{accountId}</span>
            </p>
            <p>
              <span className="font-medium text-black">role:</span> <span className="text-black">{role}</span>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-amber-600">Chưa đăng nhập (không có cookie account_id)</p>
        )}
      </div>

      <AuthTestClient />
    </div>
  )
}
