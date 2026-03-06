// Tạo file mới tại: app/products/[id]/_components/Rating.tsx
'use client'
import { Star } from 'lucide-react' // Cài đặt: npm install lucide-react

export default function Rating({ score = 5, reviews = 120 }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={`${i < score ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'
                            }`}
                    />
                ))}
            </div>

            <span
                onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs text-zinc-500 tracking-widest uppercase cursor-pointer hover:text-white transition"
            >
                ({reviews} Reviews)
            </span>
        </div>
    )
}