import { CartItem } from '@/app/_types/cart'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

export function OrderSummary({
  items,
  subtotal,
  isLoading,
}: {
  items: CartItem[]
  subtotal: number
  isLoading: boolean
}) {
  const formatVnd = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

  return (
    <div className="space-y-6">
      <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-md bg-zinc-800" />
            ))}
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 overflow-hidden rounded-md border border-zinc-700 bg-zinc-800">
                  <Image
                    src={item.product.origin_image}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-600 text-[10px]">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.product.name}</p>
                <p className="text-xs text-zinc-500">
                  {/* Nếu có giá giảm thì hiện giá giảm, không thì hiện giá gốc */}
                  {formatVnd(item.product.discount_price || item.price)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">{formatVnd(item.quantity * item.price)}</p>
            </div>
          ))
        )}
      </div>
      <Separator className="bg-zinc-800" />
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Subtotal</span>
          <span className="text-white">{formatVnd(subtotal)}</span>
        </div>
        <div className="flex justify-between border-t border-zinc-800 pt-2 text-lg font-bold">
          <span>Total</span>
          <div className="text-right">
            <span className="mr-2 text-xs text-zinc-500">VND</span>
            <span>{formatVnd(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
