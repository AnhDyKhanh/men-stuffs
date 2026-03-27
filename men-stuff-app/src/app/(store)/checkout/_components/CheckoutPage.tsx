'use client'

import { useCreatePayment } from '@/hooks/createPayment'
import { useGetCustomerCurrentCart } from '@/hooks/getCustomerCurrentCart'
import { useGetCustomerAccountInfor } from '@/hooks/getCustomerAccountInfor' // Import hook lấy profile
import { CartItem } from '@/types/cart'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, Loader2, User, LogOut, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { toast } from 'sonner'
import AddressSelector from './AddressSelector'
import { OrderSummary } from './OrderSummary'
import { PAYMENT_METHOD_LABELS } from '../_constants/payment'
import { PaymentMethod } from '@/enum/payment.enum'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function CheckoutPage() {
  const { data: cartResponse, isLoading: isCartLoading } = useGetCustomerCurrentCart()
  const { data: accountResponse } = useGetCustomerAccountInfor() // Gọi API lấy thông tin người dùng
  const { mutate: createPayment, isPending: isSubmitting } = useCreatePayment()
  const router = useRouter()

  const customer = accountResponse?.data

  // State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    phone: '',
    postalCode: '',
  })
  const [address, setAddress] = useState({ province: '', district: '' })
  const [paymentMethod, setPaymentMethod] = useState<string>('cod')
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup_at_shop' | 'home_delivery' | null>(null)
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false)

  // LOGIC AUTO-FILL: Khi customer có dữ liệu, điền ngay vào formData
  useEffect(() => {
    if (customer) {
      const nameParts = customer.full_name?.trim().split(' ') || []
      const lastName = nameParts[0] || ''
      const firstName = nameParts.slice(1).join(' ') || ''

      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
        phone: prev.phone || customer.phone || '',
      }))
    }
  }, [customer])

  const cartItems = useMemo(() => cartResponse?.cartItems ?? [], [cartResponse?.cartItems])
  const cartId = cartResponse?.cartId ?? ''

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity * item.price, 0)
  }, [cartItems])

  const handleSubmit = () => {
    if (!deliveryMethod) {
      setShowDeliveryDialog(true)
      return
    }
    
    // Validation đơn giản
    if (!formData.phone || !formData.firstName || !formData.lastName) {
      toast.error('Vui lòng điền đầy đủ thông tin liên hệ')
      return
    }

    const payload = {
      cart_id: cartId,
      total_amount: subtotal,
      payment_method: paymentMethod,
      delivery_method: deliveryMethod,
      shipping_address:
        deliveryMethod === 'pickup_at_shop'
          ? 'Showroom Men Stuffs'
          : `${formData.street}, ${address.district}, ${address.province}`.trim(),
      receiver_name: `${formData.lastName} ${formData.firstName}`.trim(),
      receiver_phone: formData.phone,
      items: cartItems.map((item: CartItem) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    createPayment(payload, {
      onSuccess: () => {
        toast.success('Thanh toán thành công')
        router.push('/cart')
      },
      onError: () => toast.error('Thanh toán thất bại'),
    })
  }

  const handleAddressChange = useCallback((p: string | null, d: string | null) => {
    setAddress((prev) => {
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
            <h1 className="text-2xl font-bold tracking-tighter">MEN STUFF</h1>
            <nav className="flex gap-2 text-[10px] text-zinc-500 uppercase">
              <Link href="/cart">Cart</Link> <span>/</span> <span className="text-white">Information</span>
            </nav>
          </header>

          {/* HIỂN THỊ LOGGED IN USER (Giống ảnh của bạn) */}
          {customer && (
            <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black font-bold text-xl">
                  {customer.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Logged in as</p>
                  <p className="text-sm font-medium">{customer.full_name}</p>
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase text-[#F7931A] tracking-widest">
                {customer.point} Points
              </p>
            </div>
          )}

          <div className="grid gap-6">
            <h2 className="text-xl font-semibold tracking-tight">Shipping Address</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First name"
                className="h-12 border-zinc-800 bg-transparent focus:border-white transition-all"
                value={formData.firstName} // FILL DATA
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input
                placeholder="Last name"
                className="h-12 border-zinc-800 bg-transparent focus:border-white transition-all"
                value={formData.lastName} // FILL DATA
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Input
                        placeholder="Street Address"
                        className="h-12 border-zinc-800 bg-transparent focus:border-white transition-all"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    />
                </div>
                <AddressSelector onAddressChange={handleAddressChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Phone number"
                className="h-12 border-zinc-800 bg-transparent focus:border-white transition-all"
                value={formData.phone} // FILL DATA
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                placeholder="Postal code (Optional)"
                className="h-12 border-zinc-800 bg-transparent focus:border-white transition-all"
                value={formData.postalCode}
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
              <SelectContent className="border-zinc-800 bg-zinc-900 text-white w-full" defaultValue={PaymentMethod.COD}>
                {Object.values(PaymentMethod).map((method: PaymentMethod) => (
                  <SelectItem key={method} value={method}>
                    {PAYMENT_METHOD_LABELS[method]}
                  </SelectItem>
                ))}
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
              onClick={() => {
                if (!deliveryMethod) {
                  setShowDeliveryDialog(true)
                  return
                }
                handleSubmit()
              }}
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thanh toán
            </Button>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
       
      </div>

      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent className="border-zinc-800 bg-black text-white">
          <DialogHeader>
            <DialogTitle>Bạn muốn nhận hàng theo cách nào?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Chọn cách nhận hàng trước khi tiếp tục thanh toán.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup_at_shop')}
              className={`w-full rounded-xl border p-4 text-left transition ${
                deliveryMethod === 'pickup_at_shop'
                  ? 'border-[#F7931A] bg-[#F7931A]/10'
                  : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'
              }`}
            >
              <p className="text-sm font-semibold">Nhận hàng tại shop</p>
              <p className="mt-1 text-xs text-zinc-400">Ưu tiên xử lý - có cập nhật trạng thái sẵn sàng</p>
            </button>

            <button
              type="button"
              disabled
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/20 p-4 text-left opacity-50"
            >
              <p className="text-sm font-semibold">Nhận hàng tại nhà</p>
              <p className="mt-1 text-xs text-zinc-500">Coming soon</p>
            </button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                if (!deliveryMethod) {
                  toast.error('Vui lòng chọn cách nhận hàng')
                  return
                }
                setShowDeliveryDialog(false)
                handleSubmit()
              }}
              className="bg-white text-black hover:bg-zinc-200"
            >
              Tiếp tục thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
