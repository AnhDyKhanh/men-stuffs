'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CartItem } from '@/app/_types/cart'

interface CartPageClientProps {
  cartItems: CartItem[]
  basePath: string
}

export default function CartPageClient({
  cartItems,
  basePath,
}: CartPageClientProps) {
  const [discountCode, setDiscountCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const router = useRouter()

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) return removeItem(id)
  }

  //ĐOẠN NÀY SAU NÀY CALL API SAU, KHÔNG LÀM TRÊN GIAO DIỆN NHƯ NÀY 
  const removeItem = (id: number) => {
  }

  const applyDiscount = () => {
    if (discountCode === 'SAVE10') setDiscountPercent(10)
    else if (discountCode === 'SAVE20') setDiscountPercent(20)
    else {
      setDiscountPercent(0)
      alert('Invalid discount code')
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const discount = (subtotal * discountPercent) / 100
  const shipping = subtotal > 1_000_000 ? 0 : 30_000
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  const handleCheckout = () => {
    router.push(`${basePath}/checkout`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 bg-gray-50 dark:bg-neutral-950">
      {/* ================= LEFT ================= */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 px-5 py-4 text-xs uppercase tracking-wide font-medium text-gray-600 dark:text-neutral-400 border-b border-gray-200 dark:border-neutral-800">
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1" />
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-200 dark:divide-neutral-800">
            {cartItems.map(item => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>

        <Link
          href={`${basePath}/products`}
          className="inline-block mt-8 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="lg:col-span-1">
        <CartSummaryBox
          subtotal={subtotal}
          discount={discount}
          discountPercent={discountPercent}
          shipping={shipping}
          tax={tax}
          total={total}
          discountCode={discountCode}
          onDiscountCodeChange={setDiscountCode}
          onApplyDiscount={applyDiscount}
          onCheckout={handleCheckout}
          basePath={basePath}
        />
      </div>
    </div>
  )
}

/* =======================
   Cart Item Row
======================= */
function CartItemRow({ item, onUpdateQuantity, onRemove }: any) {
  return (
    <div className="grid grid-cols-12 px-5 py-5 items-center text-sm text-gray-800 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-800 transition">
      {/* Product */}
      <div className="col-span-5 flex gap-4">
        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-300 dark:bg-neutral-700">
          <Image src={item.product.origin_image} alt={item.product.name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {item.product.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400">
            {item.product.color} · {item.product.size}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2 text-center font-medium">
        {item.price.toLocaleString()} VND
      </div>

      {/* Quantity */}
      <div className="col-span-2 flex justify-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 rounded-md bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600"
        >
          −
        </button>
        <input
          value={item.quantity}
          onChange={e =>
            onUpdateQuantity(item.id, Number(e.target.value) || 1)
          }
          className="w-10 text-center bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md"
        />
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-md bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600"
        >
          +
        </button>
      </div>

      {/* Total */}
      <div className="col-span-2 text-right font-semibold">
        {(item.price * item.quantity).toLocaleString()} VND
      </div>

      {/* Remove */}
      <div className="col-span-1 text-right">
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

/* =======================
   Summary Box
======================= */
function CartSummaryBox({
  subtotal,
  discount,
  discountPercent,
  shipping,
  tax,
  total,
  discountCode,
  onDiscountCodeChange,
  onApplyDiscount,
  onCheckout,
  basePath,
}: any) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 p-6 sticky top-24">
      <h2 className="text-sm uppercase tracking-widest font-semibold mb-6 text-gray-800 dark:text-neutral-200">
        Order Summary
      </h2>

      {/* Discount */}
      <div className="flex gap-2 mb-6">
        <input
          value={discountCode}
          onChange={e => onDiscountCodeChange(e.target.value)}
          placeholder="Discount code"
          className="flex-1 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2 text-sm"
        />
        <button
          onClick={onApplyDiscount}
          className="px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Apply
        </button>
      </div>

      {/* Prices */}
      <div className="space-y-3 text-sm mb-6">
        <Row label="Subtotal" value={subtotal} />
        {discount > 0 && (
          <Row label={`Discount (${discountPercent}%)`} value={-discount} />
        )}
        <Row label="Shipping" value={shipping} />
        <Row label="Tax (8%)" value={tax} />
      </div>

      {/* Total */}
      <div className="bg-gray-900 text-white rounded-xl p-4 mb-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{total.toLocaleString()} VND</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 mb-3"
      >
        Thanh toán
      </button>

      <Link
        href={`${basePath}/products`}
        className="block text-center bg-gray-200 dark:bg-neutral-800 py-3 rounded-md text-sm"
      >
        Tiếp tục mua sắm
      </Link>
    </div>
  )
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value === 0 ? 'Free' : value.toLocaleString() + ' VND'}</span>
    </div>
  )
}