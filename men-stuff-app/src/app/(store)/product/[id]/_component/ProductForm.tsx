'use client'

import { useState } from 'react'
import RequireLoginDialog from '@/components/shared/RequireLoginDialog'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProductFormProps {
  product: {
    id: string
    name: string
    price: number
  }
}

export default function ProductForm({ product }: ProductFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [showRequireLoginDialog, setShowRequireLoginDialog] = useState(false)
  const router = useRouter()
  const { mutate: addToCart, isPending } = useAddToCart()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowRequireLoginDialog(true)
    } else {
      addToCart({
        productId: product.id,
        quantity: quantity,
        priceAtTime: product.price,
      }, {
        onSuccess: () => {
          toast.success('Sản phẩm đã được thêm vào giỏ hàng')
          router.push('/')
        },
        onError: () => {
          toast.error('Thêm sản phẩm vào giỏ hàng thất bại')
        },
      }
      )
    }
  }

  return (
    <>
      <div className="flex flex-col gap-8 text-white">
        {/* Nếu ní có phần chọn Size, hãy bọc nó vào một Card hoặc div với border-white/10 */}

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* Bộ tăng giảm số lượng - Styled with Custom Tokens */}
            <div className="flex h-12 items-center rounded-full border border-white/10 bg-black/25 px-1 shadow-[0_0_24px_-16px_rgba(247,147,26,0.25)]">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-white/75 hover:bg-white/5 hover:text-[#F7931A]"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <Minus size={14} />
              </Button>

              <span className="w-10 text-center font-mono text-sm tracking-widest text-white/90">
                {String(quantity).padStart(2, '0')}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-white/75 hover:bg-white/5 hover:text-[#F7931A]"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={14} />
              </Button>
            </div>

            {/* Nút Add to Cart - Primary Gradient CTA */}
            <Button
              onClick={handleAddToCart}
              disabled={isPending}
              className="shadow-glow-orange h-12 flex-1 rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] px-6 font-semibold tracking-wider text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] active:scale-95 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
              )}
              {isPending ? 'Đang xử lý...' : 'Thêm vào giỏ'}
            </Button>
          </div>

          {/* Nút Buy Now - Glass Secondary Style */}
          <Button
            variant="outline"
            className="h-12 w-full rounded-full border-white/15 bg-white/5 font-semibold text-white transition-all hover:bg-white/10 hover:border-white/25 active:scale-[0.98]"
          >
            Mua ngay
          </Button>
        </div>
      </div>

      <RequireLoginDialog
        showRequireLoginDialog={showRequireLoginDialog}
        onClose={() => setShowRequireLoginDialog(false)}
      />
    </>
  )
}