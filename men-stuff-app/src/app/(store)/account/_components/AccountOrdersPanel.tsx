'use client'

import { useQuery } from '@tanstack/react-query'
import { API_ROUTES } from '@/constants/apiRouter'
import { getOrderStatusLabel, isProcessingOrder, STORE_ORDER_FLOW } from '@/constants/orderStatus'

type GuestOrder = {
  id: string
  order_code: string | null
  status: string | null
  created_at: string | null
  total_amount: number | null
}

type GuestOrderResponse = {
  data?: {
    orders?: GuestOrder[]
    processingCount?: number
  }
}

export default function AccountOrdersPanel() {
  const { data: orderProgress } = useQuery({
    queryKey: ['guest-orders-progress'],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.GUEST.ORDERS, { cache: 'no-store', credentials: 'include' })
      if (!res.ok) return { orders: [] as GuestOrder[], processingCount: 0 }
      const json = (await res.json()) as GuestOrderResponse
      return {
        orders: json?.data?.orders ?? [],
        processingCount: Number(json?.data?.processingCount ?? 0),
      }
    },
    staleTime: 20_000,
  })

  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-md">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-foreground text-lg font-semibold">Đơn hàng của tôi</h2>
        <span className="rounded-full bg-red-600/90 px-2.5 py-1 text-xs font-semibold text-white">
          {orderProgress?.processingCount ?? 0} đơn đang xử lý
        </span>
      </div>

      {(orderProgress?.orders?.length ?? 0) === 0 ? (
        <p className="text-muted-foreground text-sm">Bạn chưa có đơn hàng nào gần đây.</p>
      ) : (
        <div className="space-y-4">
          {orderProgress?.orders?.slice(0, 10).map((order) => {
            const status = order.status ?? 'pending'
            const currentIndex = STORE_ORDER_FLOW.indexOf(status as (typeof STORE_ORDER_FLOW)[number])
            return (
              <div key={order.id} className="border-border bg-muted/20 rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-muted-foreground font-mono text-xs">
                    Đơn {order.order_code ?? `#${order.id.slice(0, 8)}`}
                  </p>
                  <p className="text-primary text-xs">{getOrderStatusLabel(status)}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {STORE_ORDER_FLOW.map((step, idx) => {
                    const active = currentIndex >= idx
                    return (
                      <div
                        key={step}
                        className={`rounded-lg border px-2 py-2 text-center text-[11px] ${
                          active
                            ? 'border-primary/60 bg-primary/15 text-foreground'
                            : 'border-border bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        {getOrderStatusLabel(step)}
                      </div>
                    )
                  })}
                </div>
                {isProcessingOrder(status) && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Đơn hàng đang được xử lý, shop sẽ thông báo khi sẵn sàng.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
