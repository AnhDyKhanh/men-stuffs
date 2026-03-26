'use client'

import { useQuery } from '@tanstack/react-query'
import { API_ROUTES } from '@/constants/apiRouter'

type OrdersSummary = {
  data?: {
    processingCount?: number
  }
}

async function fetchProcessingOrdersCount(): Promise<number> {
  const res = await fetch(API_ROUTES.GUEST.ORDERS, {
    cache: 'no-store',
    credentials: 'include',
  })
  if (!res.ok) return 0
  const json = (await res.json()) as OrdersSummary
  return Number(json?.data?.processingCount ?? 0)
}

export default function ProcessingOrdersBadge() {
  const { data = 0 } = useQuery({
    queryKey: ['processing-orders-count'],
    queryFn: fetchProcessingOrdersCount,
    staleTime: 20_000,
  })

  if (data <= 0) return null

  return (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
      {data > 99 ? '99+' : data}
    </span>
  )
}

