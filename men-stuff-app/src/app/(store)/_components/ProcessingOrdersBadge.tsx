'use client'

import { useGuestOrderBadge } from '@/hooks/useGuestOrderBadge'

export default function ProcessingOrdersBadge() {
  const { data } = useGuestOrderBadge()

  const count = data?.count ?? 0
  if (count <= 0) return null

  return (
    <span
      title={data?.title || undefined}
      className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white"
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
