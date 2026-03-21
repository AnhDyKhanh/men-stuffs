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
      type="button"
      onClick={handleLogout}
      className="w-full rounded-xl px-4 py-3 text-left text-sm text-destructive transition hover:bg-destructive/10"
    >
      Đăng xuất
    </button>
  )
}
