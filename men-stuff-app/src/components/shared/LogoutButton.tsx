'use client'

import { useRouter } from 'next/navigation'
import { useLogout } from '@/hooks/useLogout'

export default function LogoutButton() {
  const router = useRouter()
  const { mutate: logout } = useLogout()

  const handleLogout = async () => {
    logout()
    router.push('/login')
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
