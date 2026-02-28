'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  size: string
  color: string
}

interface CartPageClientProps {
  cartItems: CartItem[]
  locale: string
  dict: any
}

export default function CartPageClient({
  cartItems: initialItems,
  locale,
  dict
}: CartPageClientProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems)
  const [discountCode, setDiscountCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [showInvoice, setShowInvoice] = useState(false)

  // Update quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(
      cartItems.map(item => (item.id === id ? { ...item, quantity } : item))
    )
  }

  // Remove item
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  // Apply discount
  const applyDiscount = () => {
    if (discountCode === 'SAVE10') {
      setDiscountPercent(10)
    } else if (discountCode === 'SAVE20') {
      setDiscountPercent(20)
    } else {
      setDiscountPercent(0)
      alert('Invalid discount code')
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = (subtotal * discountPercent) / 100
  const shipping = subtotal > 1000000 ? 0 : 30000
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="bg-gray-100 p-4 grid grid-cols-12 gap-4 text-sm font-semibold border-b">
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>

          {/* Cart Items */}
          <div className="divide-y">
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

        {/* Continue Shopping Button */}
        <div className="mt-6">
          <Link
            href={`/${locale}/products`}
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded transition"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {/* Right: Summary & Invoice */}
      <div className="lg:col-span-1">
        {!showInvoice ? (
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
            onCheckout={() => setShowInvoice(true)}
            locale={locale}
          />
        ) : (
          <InvoiceBox
            items={cartItems}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            tax={tax}
            total={total}
            onBack={() => setShowInvoice(false)}
          />
        )}
      </div>
    </div>
  )
}

// Cart Item Row Component
function CartItemRow({ item, onUpdateQuantity, onRemove }: any) {
  return (
    <div className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition">
      {/* Product Image & Info */}
      <div className="col-span-5 flex gap-3">
        <div className="w-16 h-16 relative flex-shrink-0 bg-gray-200 rounded overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{item.name}</h3>
          <p className="text-xs text-gray-600 mt-1">
            Color: <span className="text-gray-800">{item.color}</span>
          </p>
          <p className="text-xs text-gray-600">
            Size: <span className="text-gray-800">{item.size}</span>
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2 text-center">
        <p className="text-sm font-medium">
          {item.price.toLocaleString('en-US')} đ
        </p>
      </div>

      {/* Quantity */}
      <div className="col-span-2 flex items-center justify-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-sm"
        >
          −
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={e => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
          className="w-10 text-center border border-gray-300 rounded text-sm py-1"
        />
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-sm"
        >
          +
        </button>
      </div>

      {/* Total */}
      <div className="col-span-2 text-right">
        <p className="font-semibold">
          {(item.price * item.quantity).toLocaleString('en-US')} đ
        </p>
      </div>

      {/* Remove Button */}
      <div className="col-span-1 flex justify-end">
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 transition text-lg font-bold"
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Cart Summary Component
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
  locale
}: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-20">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Discount Code Input */}
      <div className="mb-6">
        <label className="text-sm text-gray-700 block mb-2">Discount Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={e => onDiscountCodeChange(e.target.value)}
            placeholder="Enter code"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={onApplyDiscount}
            className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded text-sm transition"
          >
            Apply
          </button>
        </div>
        {discountPercent > 0 && (
          <p className="text-green-600 text-xs mt-2">✓ Valid code ({discountPercent}% off)</p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-b">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{subtotal.toLocaleString('en-US')} đ</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({discountPercent}%):</span>
            <span>-{discount.toLocaleString('en-US')} đ</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : shipping.toLocaleString('en-US') + ' đ'}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8%):</span>
          <span className="font-medium">{tax.toLocaleString('en-US')} đ</span>
        </div>
      </div>

      {/* Total */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total:</span>
          <span className="text-2xl font-bold">{total.toLocaleString('en-US')} đ</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Free shipping for orders over 1,000,000 đ</p>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition mb-3"
      >
        Proceed to Checkout
      </button>

      <Link
        href={`/${locale}/products`}
        className="block w-full bg-gray-200 text-gray-800 text-center font-bold py-3 rounded hover:bg-gray-300 transition"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

// Invoice Component
function InvoiceBox({ items, subtotal, discount, shipping, tax, total, onBack }: any) {
  const currentDate = new Date()
  const estimatedDelivery = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000)
  const orderId = crypto.randomUUID().substring(0, 7).toUpperCase()

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-20">
      <h2 className="text-xl font-bold mb-4">Invoice</h2>

      {/* Order Info */}
      <div className="bg-gray-100 rounded p-4 mb-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-mono font-bold">#{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span>{currentDate.toLocaleDateString('en-US')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Est. Delivery:</span>
          <span>{estimatedDelivery.toLocaleDateString('en-US')}</span>
        </div>
      </div>

      {/* Items */}
      <div className="mb-4 pb-4 border-b">
        <h3 className="font-semibold mb-3 text-sm">Items:</h3>
        <div className="space-y-2 text-xs">
          {items.map((item: CartItem) => (
            <div key={item.id} className="flex justify-between text-gray-600">
              <span>{item.name} x{item.quantity}</span>
              <span>{(item.price * item.quantity).toLocaleString('en-US')} đ</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span>{subtotal.toLocaleString('en-US')} đ</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping:</span>
          <span>{shipping === 0 ? 'Free' : shipping.toLocaleString('en-US') + ' đ'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax:</span>
          <span>{tax.toLocaleString('en-US')} đ</span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-black text-white rounded p-3 mb-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>{total.toLocaleString('en-US')} đ</span>
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3 text-xs">
        <p className="text-blue-800 font-semibold mb-1">📍 Shipping Address:</p>
        <p className="text-gray-700">To be updated during checkout</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 text-xs">
        <p className="text-green-800 font-semibold mb-1">💳 Payment Method:</p>
        <p className="text-gray-700">To be selected during checkout</p>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => window.print()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition font-semibold"
        >
          🖨️ Print Invoice
        </button>
        <button
          onClick={onBack}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded text-sm transition font-semibold"
        >
          ← Back to Cart
        </button>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded text-sm font-semibold transition">
          ✓ Confirm Order
        </button>
      </div>
    </div>
  )
}