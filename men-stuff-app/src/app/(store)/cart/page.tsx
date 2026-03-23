'use client'

import { useGetCustomerCurrentCart } from '@/hooks/getCustomerCurrentCart'
import { BASE_PATH } from '@/lib/labels'
import Link from 'next/link'
import CartPageClient from './_components/CartPageClient'

export default function CartPage() {
  const { data: cartItemsDataNew, isLoading } = useGetCustomerCurrentCart()
  const cartItems = cartItemsDataNew?.cartItems ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {isLoading ? (
        <div className="py-16 text-center">
          <p className="font-mono text-xs tracking-widest text-white/60 uppercase">Đang tải giỏ hàng…</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-6 text-2xl font-semibold text-white">Giỏ hàng trống</p>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/60">
            Chưa có sản phẩm nào trong giỏ. Hãy quay lại danh sách sản phẩm để tiếp tục mua sắm.
          </p>
          <Link
            href={`${BASE_PATH}/products`}
            className="inline-flex h-11 items-center justify-center rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] px-6 text-sm font-semibold tracking-wider text-white shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] transition hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <CartPageClient cartItems={cartItems} basePath={BASE_PATH} />
      )}
    </div>
  )
}
