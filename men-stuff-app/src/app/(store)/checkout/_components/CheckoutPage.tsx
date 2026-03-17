'use client'

import { useCreatePayment } from '@/app/_hooks/createPayment'
import { useGetCustomerCurrentCart } from '@/app/_hooks/getCustomerCurrentCart'
import { CartItem } from '@/app/_types/cart'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddressSelector from './AddressSelector'
import { OrderSummary } from './OrderSummary'

export default function CheckoutPage() {
  const { data: cartResponse, isLoading } = useGetCustomerCurrentCart()
  const { mutate: createPayment, isPending: isSubmitting } = useCreatePayment()

  // State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    phone: '',
    postalCode: '',
  })
  const [address, setAddress] = useState({ province: '', district: '' })
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'momo'>('cod')

  const cartItems = useMemo(() => cartResponse?.cartItems ?? [], [cartResponse?.cartItems])
  const cartId = cartResponse?.cartId ?? ''

  // Tính toán logic (Dùng useMemo để tránh re-render rác)
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum: number, item: CartItem) => {
      return sum + item.quantity * item.price
    }, 0)
  }, [cartItems])

  const handleSubmit = () => {
    if (!formData.phone || !address.province || !formData.street) {
      return toast.error('Vui lòng điền đầy đủ thông tin giao hàng')
    }

    const payload = {
      cart_id: cartId,
      total_amount: subtotal,
      payment_method: paymentMethod,
      shipping_address: `${formData.street}, ${address.district}, ${address.province}`.trim(),
      receiver_name: `${formData.firstName} ${formData.lastName}`.trim(),
      receiver_phone: formData.phone,
      items: cartItems.map((item: CartItem) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    createPayment(payload)
  }

  const handleAddressChange = useCallback((p: string | null, d: string | null) => {
    setAddress((prev) => {
      // Chỉ update nếu giá trị thực sự thay đổi để chặn đứng vòng lặp
      if (prev.province === (p ?? '') && prev.district === (d ?? '')) return prev
      return { province: p ?? '', district: d ?? '' }
    })
  }, [])

  return (
    <div className="min-h-screen bg-black p-6 text-white md:p-12">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
        {/* LEFT: INFORMATION */}
        <div className="space-y-8 md:col-span-7">
          <header className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tighter">HELIOS GLOBAL</h1>
            <nav className="flex gap-2 text-[10px] text-zinc-500 uppercase">
              <Link href="/cart">Cart</Link> <span>/</span> <span className="text-white">Information</span>
            </nav>
          </header>

          <div className="grid gap-4">
            <h2 className="text-lg font-medium">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First name"
                className="border-zinc-800 bg-transparent"
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input
                placeholder="Last name"
                className="border-zinc-800 bg-transparent"
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <Input
              placeholder="Street Address"
              className="border-zinc-800 bg-transparent"
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            />

            <AddressSelector onAddressChange={handleAddressChange} />

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Phone number"
                className="border-zinc-800 bg-transparent"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                placeholder="Postal code (Optional)"
                className="border-zinc-800 bg-transparent"
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Payment</h2>
            <Select onValueChange={(v: any) => setPaymentMethod(v)} defaultValue="cod">
              <SelectTrigger className="h-14 border-zinc-800 bg-zinc-900">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-white">
                <SelectItem value="cod">COD (Thanh toán khi nhận hàng)</SelectItem>
                <SelectItem value="bank_transfer">Chuyển khoản ngân hàng</SelectItem>
                <SelectItem value="momo">Ví MoMo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Link href="/cart" className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
              <ChevronLeft size={16} /> Return
            </Link>
            <Button
              size="lg"
              className="rounded-none bg-white px-8 py-6 font-bold tracking-widest text-black uppercase hover:bg-zinc-200"
              onClick={handleSubmit}
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Order
            </Button>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="sticky top-12 h-fit rounded-2xl border border-zinc-900 bg-zinc-900/20 p-8 md:col-span-5">
          <OrderSummary items={cartItems} subtotal={subtotal} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
