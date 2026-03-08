'use client'

import { useState } from 'react'
import { useAddToCart } from './useAddToCart' // Import hook vừa tạo

interface ProductFormProps {
    product: {
        id: string;
        name: string;
        price: number;
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
            size: selectedSize
        })
    }

    return (
        <div className="flex flex-col gap-8 text-white">
            {/* ... (Phần chọn Size và Số lượng giữ nguyên như cũ) ... */}

            <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                    {/* Bộ tăng giảm số lượng */}
                    <div className="flex items-center border border-gray-700 h-12">
                        <button
                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                            className="px-4 text-xl hover:bg-gray-800">-</button>
                        <span className="w-12 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-4 text-xl hover:bg-gray-800">+</button>
                    </div>

                    {/* Nút Add to Cart với trạng thái Loading */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isPending}
                        className="flex-1 bg-white text-black h-12 font-bold uppercase tracking-tighter hover:bg-gray-200 transition disabled:bg-gray-400"
                    >
                        {isPending ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>

                {/* Nút Buy Now */}
                <button className="w-full bg-[#5a31f4] text-white h-12 font-bold rounded-md hover:opacity-90 transition">
                    Buy with shop
                </button>
            </div>
        </div>
    )
}