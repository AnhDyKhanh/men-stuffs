'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'

/**
 * Logout button component for admin
 */
export default function LogoutButton({ lang }: { lang: string }) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push(`/${lang}/login`)
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-lg px-4 py-3 text-left text-red-600 transition hover:bg-red-50 hover:text-red-700"
    >
      Đăng xuất
    </button>
  )
}
