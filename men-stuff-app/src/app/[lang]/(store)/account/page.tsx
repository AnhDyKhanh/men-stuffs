'use client'

import LogoutButton from '@/app/[lang]/_components/admin/LogoutButton'
import { useGetCustomerCurrentCart } from '@/app/_hooks/getCustomerCurrentCart'

export default function AccountPage() {
  const { data: customerCurrentCart } = useGetCustomerCurrentCart()
  console.log('customerCurrentCart', customerCurrentCart)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Tài khoản</h1>
      <p className="text-gray-600">Trang tài khoản cá nhân.</p>

      <LogoutButton lang="vi" />
    </div>
  )
}
