'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CartItem } from '@/types/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Minus, Plus, Trash2, ArrowLeft, TicketPercent } from 'lucide-react'
import { toast } from 'sonner'

interface CartPageClientProps {
  cartItems: CartItem[]
  basePath: string
}

export default function CartPageClient({ cartItems, basePath }: CartPageClientProps) {
  const [discountCode, setDiscountCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const router = useRouter()

  const formatVnd = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

  const stats = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const discount = (subtotal * discountPercent) / 100
    const shipping = subtotal > 1_000_000 ? 0 : 30_000
    const tax = (subtotal - discount) * 0.08
    const total = subtotal - discount + shipping + tax
    return { subtotal, discount, shipping, tax, total }
  }, [cartItems, discountPercent])

  const handleApplyDiscount = () => {
    if (discountCode === 'SAVE10') {
      setDiscountPercent(10)
      toast.success('Đã áp dụng giảm giá 10%')
    } else {
      setDiscountPercent(0)
      toast.error('Mã không hợp lệ')
    }
  }

  return (
    <div className="py-2">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Giỏ hàng</h1>
          <p className="mt-2 text-sm text-white/60">
            Kiểm tra sản phẩm, áp dụng mã giảm giá và hoàn tất thanh toán.
          </p>
        </div>
        <div className="font-mono text-xs tracking-widest text-white/50 uppercase">
          {cartItems.length} item{cartItems.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT: PRODUCTS */}
        <div className="space-y-6 lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F1115]/70 shadow-[0_0_50px_-14px_rgba(247,147,26,0.10)] backdrop-blur">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/10">
                  <TableHead className="font-mono text-[11px] font-medium tracking-widest text-white/55 uppercase">
                    Sản phẩm
                  </TableHead>
                  <TableHead className="text-center font-mono text-[11px] font-medium tracking-widest text-white/55 uppercase">
                    Giá
                  </TableHead>
                  <TableHead className="text-center font-mono text-[11px] font-medium tracking-widest text-white/55 uppercase">
                    Số lượng
                  </TableHead>
                  <TableHead className="text-right font-mono text-[11px] font-medium tracking-widest text-white/55 uppercase">
                    Tổng
                  </TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                      Chưa có sản phẩm nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  cartItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-white/10 transition-colors hover:bg-white/3"
                    >
                      <TableCell>
                        <div className="flex gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30 shadow-[0_0_30px_-18px_rgba(247,147,26,0.25)]">
                            <Image
                              src={item.product.origin_image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="line-clamp-2 text-sm font-medium text-white">{item.product.name}</span>
                            <span className="mt-1 font-mono text-[11px] tracking-widest text-white/50 uppercase">
                              #{item.product.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm text-white/75">{formatVnd(item.price)}</TableCell>
                      <TableCell>
                        <div className="mx-auto flex w-fit items-center rounded-full border border-white/10 bg-black/25 px-1">
                          <button
                            type="button"
                            className="rounded-full p-2 text-white/55 transition hover:bg-white/5 hover:text-[#F7931A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]"
                            aria-label="Giảm số lượng"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-9 text-center font-mono text-xs tracking-widest text-white/80">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="rounded-full p-2 text-white/55 transition hover:bg-white/5 hover:text-[#F7931A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]"
                            aria-label="Tăng số lượng"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium text-white">
                        {formatVnd(item.price * item.quantity)}
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-white/35 transition hover:bg-white/5 hover:text-[#EA580C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Link
            href={`${basePath}/products`}
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-white/55 uppercase transition hover:text-white"
          >
            <ArrowLeft size={14} /> Quay lại cửa hàng
          </Link>
        </div>

        {/* RIGHT: SUMMARY */}
        <aside className="lg:col-span-4">
          <Card className="border-white/10 bg-[#0F1115]/70 shadow-[0_0_50px_-14px_rgba(247,147,26,0.12)] backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-white">Chi tiết thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                  <Input
                    placeholder="Mã giảm giá"
                    className="h-11 rounded-full border-white/10 bg-black/35 pl-9 text-sm text-white placeholder:text-white/30 focus-visible:ring-[#F7931A] focus-visible:ring-offset-0"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleApplyDiscount}
                  className="h-11 rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] px-5 text-xs font-semibold tracking-wider text-white shadow-[0_0_20px_-10px_rgba(234,88,12,0.55)] transition hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.65)]"
                >
                  ÁP DỤNG
                </Button>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between font-mono text-[11px] tracking-widest text-white/55 uppercase">
                  <span>Tạm tính</span>
                  <span className="text-white/80">{formatVnd(stats.subtotal)}</span>
                </div>
                {stats.discount > 0 && (
                  <div className="flex justify-between font-mono text-[11px] tracking-widest text-[#F7931A] uppercase">
                    <span>Giảm giá</span>
                    <span>-{formatVnd(stats.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-mono text-[11px] tracking-widest text-white/55 uppercase">
                  <span>Vận chuyển</span>
                  <span className="text-white/80">{stats.shipping === 0 ? 'Miễn phí' : formatVnd(stats.shipping)}</span>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-4">
                <span className="font-mono text-[11px] tracking-widest text-white/55 uppercase">Tổng cộng</span>
                <span className="text-2xl font-semibold text-gradient-gold">{formatVnd(stats.total)}</span>
              </div>

              <Button
                onClick={() => router.push(`${basePath}/checkout`)}
                className="h-12 w-full rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] text-sm font-semibold tracking-wider text-white shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] transition hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)]"
              >
                Thanh toán ngay
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}