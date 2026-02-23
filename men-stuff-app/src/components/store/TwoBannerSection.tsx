import Link from 'next/link'
import type { BannerItem } from '@/app/_constants/placeholderData'

interface TwoBannerSectionProps {
  items: [BannerItem, BannerItem]
}

export default function TwoBannerSection({ items }: TwoBannerSectionProps) {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 gap-0"
      aria-label="Promotional banners"
    >
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group relative block aspect-square min-h-[280px] overflow-hidden bg-neutral-300 md:aspect-square"
        >
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-105"
            width={800}
            height={800}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
            <h3 className="px-4 text-center text-xl font-semibold uppercase tracking-wider text-white drop-shadow-md md:text-2xl">
              {item.title}
            </h3>
          </div>
        </Link>
      ))}
    </section>
  )
}
