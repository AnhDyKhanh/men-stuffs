'use client'

import { useAddToCart } from '@/app/_hooks/useAddToCart'
import { useState } from 'react'

interface ProductFormProps {
  product: {
    id: string
    name: string
    price: number
  }
}

export default function ProductForm({ product }: ProductFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('5.5')

  // Khởi tạo mutation
  const { mutate: addToCart, isPending } = useAddToCart()

  const handleAddToCart = () => {
    // Gọi API
    addToCart({
      productId: product.id,
      quantity: quantity,
      size: selectedSize,
    })
  }

  return (
    <div className="flex flex-col gap-8 text-white">
      {/* ... (Phần chọn Size và Số lượng giữ nguyên như cũ) ... */}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {/* Bộ tăng giảm số lượng */}
          <div className="flex h-12 items-center rounded-full border border-white/10 bg-black/25 shadow-[0_0_24px_-16px_rgba(247,147,26,0.25)]">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="rounded-full px-4 text-xl text-white/75 transition hover:bg-white/5 hover:text-[#F7931A]"
            >
              -
            </button>
            <span className="w-12 text-center font-mono text-sm tracking-widest text-white/90">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="rounded-full px-4 text-xl text-white/75 transition hover:bg-white/5 hover:text-[#F7931A]"
            >
              +
            </button>
          </div>

          {/* Nút Add to Cart với trạng thái Loading */}
          <button
            onClick={handleAddToCart}
            disabled={isPending}
            className="shadow-glow-orange h-12 flex-1 rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] px-6 font-semibold tracking-wider text-white uppercase transition hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)] disabled:opacity-60 disabled:shadow-none"
          >
            {isPending ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>

        {/* Nút Buy Now */}
        <button className="h-12 w-full rounded-full border border-white/15 bg-white/5 font-semibold text-white transition hover:bg-white/8">
          Buy now
        </button>
      </div>
    </div>
  )
}
