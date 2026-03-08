'use client'

import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import AddressSelector from './_components/AddressSelector'

export default function CheckoutPage() {
  return (
    <div className="bg-black min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-12 gap-16">

        {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG (7 COLUMNS) */}
        <div className="md:col-span-7 space-y-12">
          {/* Logo & Breadcrumb */}
          <div>
            <h1 className="text-2xl font-bold tracking-widest uppercase mb-6 text-center md:text-left">
              HELIOS GLOBAL
            </h1>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500">
              <Link href="/cart" className="hover:text-white transition">Cart</Link>
              <span>/</span>
              <span className="text-white">Information</span>
              <span>/</span>
              <span>Shipping</span>
              <span>/</span>
              <span>Payment</span>
            </nav>
          </div>

          {/* Form Thông tin */}
          <section className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-lg font-medium">Contact Information</h2>
              <p className="text-xs text-gray-400">Already have an account? <span className="underline cursor-pointer">Log in</span></p>
            </div>
            <input
              type="text"
              placeholder="Email or mobile phone number"
              className="w-full bg-transparent border border-zinc-800 p-4 rounded-md focus:border-white outline-none transition"
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium mb-2 tracking-tight">Shipping Address</h2>

            {/* Hàng 1: Họ và Tên */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name"
                className="bg-transparent border border-zinc-800 p-4 rounded-md focus:border-white outline-none transition"
              />
              <input
                type="text"
                placeholder="Last name"
                className="bg-transparent border border-zinc-800 p-4 rounded-md focus:border-white outline-none transition"
              />
            </div>

            {/* Hàng 2: Địa chỉ nhà */}
            <input
              type="text"
              placeholder="Address (Street, House number...)"
              className="w-full bg-transparent border border-zinc-800 p-4 rounded-md focus:border-white outline-none transition"
            />

            {/* Hàng 3: Bộ chọn City & District tự động */}
            {/* Lưu ý: Không bọc AddressSelector vào thẻ select hay div grid nào khác nữa */}
            <AddressSelector />

            {/* Hàng 4: Postal code và Phone number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Postal code (Optional)"
                className="bg-transparent border border-zinc-800 p-4 rounded-md focus:border-white outline-none transition"
              />
              <input
                type="text"
                placeholder="Phone number"
                className="bg-transparent border border-zinc-800 p-4 rounded-md focus:border-white outline-none transition"
              />
            </div>
          </section>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8">
            <Link href="/cart" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
              <ChevronLeft size={16} /> Return to cart
            </Link>
            <button className="group relative overflow-hidden bg-white text-black px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-zinc-200 active:scale-95 shadow-lg shadow-white/5">
              <span className="relative z-10 flex items-center gap-3">
                Continue to shipping
                <svg
                  className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d=" housekeeper 17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (5 COLUMNS) */}
        <div className="md:col-span-5 bg-zinc-900/30 p-8 rounded-xl border border-zinc-900 h-fit sticky top-12">
          <div className="space-y-6">
            {/* Danh sách sản phẩm trong giỏ */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-zinc-800 rounded-md overflow-hidden border border-zinc-700">
                  <Image src="/path-to-your-product.jpg" alt="product" width={64} height={64} className="object-cover" />
                </div>
                <span className="absolute -top-2 -right-2 bg-zinc-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Solar Warden Black Silver</p>
                <p className="text-xs text-gray-500 uppercase">Size: 9</p>
              </div>
              <p className="text-sm font-medium">4.928.000₫</p>
            </div>

            <hr className="border-zinc-800" />

            {/* Mã giảm giá */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Discount code"
                className="flex-1 bg-transparent border border-zinc-800 p-3 rounded-md focus:border-white outline-none"
              />
              <button className="bg-zinc-800 px-6 rounded-md text-sm font-medium text-gray-400 hover:text-white transition">Apply</button>
            </div>

            <hr className="border-zinc-800" />

            {/* Tính toán tiền */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">4.928.000₫</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-xs italic">Calculated at next step</span>
              </div>
            </div>

            <hr className="border-zinc-800" />

            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-medium">Total</span>
              <div className="text-right">
                <span className="text-xs text-gray-500 mr-2">VND</span>
                <span className="text-2xl font-bold">4.928.000₫</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}