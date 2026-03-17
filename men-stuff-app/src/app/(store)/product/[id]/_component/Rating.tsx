// Tạo file mới tại: app/products/[id]/_components/Rating.tsx
'use client'
import { Star } from 'lucide-react' // Cài đặt: npm install lucide-react

export default function Rating({ score = 5, reviews = 120 }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className={`${i < score ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`} />
        ))}
      </div>
      =
      <span
        onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
        className="cursor-pointer text-xs tracking-widest text-zinc-500 uppercase transition hover:text-white"
      >
        ({reviews} Reviews)
      </span>
    </div>
  )
}
