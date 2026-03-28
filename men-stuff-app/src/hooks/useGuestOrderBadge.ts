'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { API_ROUTES } from '@/constants/apiRouter'
import { ORDERS_SEEN_EVENT } from '@/lib/ordersSeen'
import { buildGuestOrdersBadgePayload, applySeenToBadgePayload } from '@/lib/guestOrdersBadgeShared'

type OrdersResponse = {
  data?: {
    processingCount?: number
    orders?: Array<{ id: string; order_code: string | null; status: string | null }>
  }
}

export function useGuestOrderBadge() {
  const [seenTick, setSeenTick] = useState(0)

  useEffect(() => {
    const fn = () => setSeenTick((t) => t + 1)
    window.addEventListener(ORDERS_SEEN_EVENT, fn)
    return () => window.removeEventListener(ORDERS_SEEN_EVENT, fn)
  }, [])

  return useQuery({
    queryKey: ['guest-order-badge', seenTick],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.GUEST.ORDERS, {
        cache: 'no-store',
        credentials: 'include',
      })
      if (!res.ok) {
        return { count: 0, title: '', orders: [] as Array<{ id: string; order_code: string | null; status: string | null }> }
      }
      const json = (await res.json()) as OrdersResponse
      const orders = json?.data?.orders ?? []
      const processingCount = Number(json?.data?.processingCount ?? 0)
      const payload = buildGuestOrdersBadgePayload(orders, processingCount)
      return applySeenToBadgePayload(payload)
    },
    staleTime: 20_000,
  })
}
