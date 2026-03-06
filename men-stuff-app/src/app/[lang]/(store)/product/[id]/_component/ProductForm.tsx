'use client'

import { useState } from 'react'

const SIZES = ['5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12']

export default function ProductForm() {
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState('5.5')

    return (
        <div className="flex flex-col gap-8 text-white">
            {/* Chọn Size */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold uppercase tracking-widest">Size</span>
                    <span className="text-xs underline cursor-pointer text-gray-400 hover:text-white">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-4">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`text-sm transition-all pb-1 border-b-2 ${selectedSize === size ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-white'
                                }`}
                        >
                            Size {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Số lượng & Add to Cart */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                    {/* Bộ tăng giảm số lượng */}
                    <div className="flex items-center border border-gray-700 h-12">
                        <button
                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                            className="px-4 text-xl hover:bg-gray-800 transition">-</button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-4 text-xl hover:bg-gray-800 transition">+</button>
                    </div>

                    {/* Nút Add to Cart */}
                    <button className="flex-1 bg-white text-black h-12 font-bold uppercase tracking-tighter hover:bg-gray-200 transition">
                        Add to Cart
                    </button>
                </div>

                {/* Nút Buy with ShopPay (Màu tím đặc trưng) */}
                <button className="w-full bg-[#5a31f4] text-white h-12 font-bold rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition">
                    Buy with <span className="italic">shop</span>
                </button>

                <p className="text-center text-xs text-gray-400 underline cursor-pointer">More payment options</p>
            </div>
        </div>
    )
}