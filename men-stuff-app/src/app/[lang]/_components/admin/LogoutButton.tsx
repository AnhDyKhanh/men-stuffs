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
      className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition"
    >
      Đăng xuất
    </button>
  )
}
