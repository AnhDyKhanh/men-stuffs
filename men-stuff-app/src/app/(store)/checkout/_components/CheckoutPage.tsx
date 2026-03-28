'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PaymentMethod } from '@/enum/payment.enum'
import { useCreatePayment } from '@/hooks/createPayment'
import { useGetCustomerAccountInfor } from '@/hooks/getCustomerAccountInfor'
import { useGetCustomerCurrentCart } from '@/hooks/getCustomerCurrentCart'
import { CartItem } from '@/types/cart'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AddressSelector from './AddressSelector'
import { OrderSummary } from './OrderSummary'

type Customer = {
  id?: string
  full_name: string
  phone?: string
  avata?: string
  point?: number
}

type FormData = {
  firstName: string
  lastName: string
  street: string
  phone: string
  postalCode: string
  avata: string
}

function CheckoutForm({
  customer,
  cartItems,
  cartId,
}: {
  customer: Customer
  cartItems: CartItem[]
  cartId: string
}) {
  const { mutate: createPayment, isPending: isSubmitting } = useCreatePayment()
  const router = useRouter()

  const { avata, phone, full_name, point } = customer

  const nameParts = full_name?.trim().split(' ') || []
  const [formData, setFormData] = useState<FormData>({
    firstName: nameParts.slice(1).join(' ') || '',
    lastName: nameParts[0] || '',
    phone: phone || '',
    street: '',
    postalCode: '',
    avata: avata || '',
  })

  const [address, setAddress] = useState({ province: '', district: '' })
  const [paymentMethod, setPaymentMethod] = useState<string>('cod')
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup_at_shop' | 'home_delivery' | null>(null)
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false)

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity * item.price, 0)
  }, [cartItems])

  const handleAddressChange = useCallback((p: string | null, d: string | null) => {
    setAddress((prev) => {
      if (prev.province === (p ?? '') && prev.district === (d ?? '')) return prev
      return { province: p ?? '', district: d ?? '' }
    })
  }, [])

  const handleSubmit = useCallback(() => {
    if (!deliveryMethod) {
      setShowDeliveryDialog(true)
      return
    }
    if (!formData.phone || !formData.firstName || !formData.lastName) {
      toast.error('Vui lòng điền đầy đủ thông tin liên hệ')
      return
    }

    const payload = {
      cart_id: cartId,
      total_amount: subtotal,
      payment_method: paymentMethod ?? PaymentMethod.AT_SHOP,
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
        router.push('/')
      },
      onError: () => toast.error('Thanh toán thất bại'),
    })
  }, [deliveryMethod, formData, cartId, subtotal, paymentMethod, address, cartItems, createPayment, router])

  return (
    <>
      <div className="min-h-screen bg-black p-6 text-white md:p-12">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 space-y-4">
            <h1 className="text-2xl font-bold tracking-tighter">MEN STUFF</h1>
            <nav className="flex gap-2 text-[10px] text-zinc-500 uppercase">
              <Link href="/cart">Cart</Link> <span>/</span>{' '}
              <span className="text-white">Information</span>
            </nav>
          </header>

          <div className="grid gap-12 md:grid-cols-12">
            <div className="space-y-8 md:col-span-7">
              <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-4">
                  {avata ? (
                    <Image
                      src={avata}
                      alt={full_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 text-white font-bold text-xl">
                      {full_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Logged in as
                    </p>
                    <p className="text-sm font-medium">{full_name}</p>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#F7931A]">
                  {point} Points
                </p>
              </div>

              <div className="grid gap-6">
                <h2 className="text-xl font-semibold tracking-tight">Shipping Address</h2>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="First name"
                    className="h-12 border-zinc-800 bg-transparent transition-all focus:border-white"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    placeholder="Last name"
                    className="h-12 border-zinc-800 bg-transparent transition-all focus:border-white"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Street Address"
                      className="h-12 border-zinc-800 bg-transparent transition-all focus:border-white"
                      value={formData.street}
                      onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
                    />
                  </div>
                  <AddressSelector onAddressChange={handleAddressChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Phone number"
                    className="h-12 border-zinc-800 bg-transparent transition-all focus:border-white"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    placeholder="Postal code (Optional)"
                    className="h-12 border-zinc-800 bg-transparent transition-all focus:border-white"
                    value={formData.postalCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
              </div>

              {/* <div className="space-y-4">
                <h2 className="text-lg font-medium">Payment</h2>
                <Select onValueChange={(v) => setPaymentMethod(v)} defaultValue="cod">
                  <SelectTrigger className="h-14 border-zinc-800 bg-zinc-900">
                    <SelectValue placeholder="Payment method" />
                  </SelectTrigger>
                  <SelectContent
                    className="w-full border-zinc-800 bg-zinc-900 text-white"
                    defaultValue={PaymentMethod.COD}
                  >
                    {Object.values(PaymentMethod).map((method: PaymentMethod) => (
                      <SelectItem key={method} value={method}>
                        {PAYMENT_METHOD_LABELS[method]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="flex items-center justify-between pt-6">
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                >
                  <ChevronLeft size={16} /> Return
                </Link>
                <Button
                  size="lg"
                  className="rounded-none bg-white px-8 py-6 font-bold uppercase tracking-widest text-black hover:bg-zinc-200"
                  onClick={handleSubmit}
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Thanh toán
                </Button>
              </div>
            </div>

            <div className="md:col-span-5">
              <OrderSummary items={cartItems} subtotal={subtotal} isLoading={isSubmitting} />
            </div>
          </div>
        </div>
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
              className={`w-full rounded-xl border p-4 text-left transition ${deliveryMethod === 'pickup_at_shop'
                ? 'border-[#F7931A] bg-[#F7931A]/10'
                : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'
                }`}
            >
              <p className="text-sm font-semibold">Nhận hàng tại shop</p>
              <p className="mt-1 text-xs text-zinc-400">
                Ưu tiên xử lý, có cập nhật trạng thái sẵn sàng
              </p>
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
    </>
  )
}

export default function CheckoutPage() {
  const { data: cartResponse, isLoading: isCartLoading } = useGetCustomerCurrentCart()
  const { data: accountResponse, isLoading: isAccountLoading } = useGetCustomerAccountInfor()

  const customer = accountResponse?.data
  const cartItems = cartResponse?.cartItems ?? []
  const cartId = cartResponse?.cartId ?? ''

  if (isCartLoading || isAccountLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#F7931A]" />
          <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
            Đang tải...
          </p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="mb-4 text-lg">Vui lòng đăng nhập để thanh toán</p>
          <Link
            href="/login"
            className="text-sm text-[#F7931A] underline underline-offset-4"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  return (
    <CheckoutForm
      key={customer.id ?? customer.full_name}
      customer={customer}
      cartItems={cartItems}
      cartId={cartId}
    />
  )
}