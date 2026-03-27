import { getOrderStatusLabel, isProcessingOrder } from '@/constants/orderStatus'
import { readSeenSnapshot, computeOrdersSnapshot } from '@/lib/ordersSeen'

type GuestOrder = {
  id: string
  order_code: string | null
  status: string | null
}

export type GuestOrdersBadgePayload = {
  count: number
  title: string
  orders: GuestOrder[]
}

export function buildGuestOrdersBadgePayload(
  orders: GuestOrder[],
  processingCount: number,
): GuestOrdersBadgePayload {
  const active = orders.filter((o) => isProcessingOrder(o.status))
  const lines = active.slice(0, 6).map((o) => {
    const code = o.order_code ?? `Đơn ${o.id.slice(0, 8)}`
    return `${code}: ${getOrderStatusLabel(o.status)}`
  })
  const title =
    lines.length > 0
      ? [`${processingCount} đơn đang theo dõi`, ...lines.map((l) => `• ${l}`)].join('\n')
      : processingCount > 0
        ? `${processingCount} đơn đang theo dõi tiến độ nhận tại shop`
        : ''

  return { count: processingCount, title, orders }
}

/** Ẩn badge khi tập đơn đang xử lý trùng lần “đã xem” cuối (tab đơn hoặc lịch sử). */
export function applySeenToBadgePayload(payload: GuestOrdersBadgePayload): { count: number; title: string } {
  const processingOnly = payload.orders.filter((o) => isProcessingOrder(o.status))
  const snap = computeOrdersSnapshot(processingOnly)
  const seen = readSeenSnapshot()
  if (seen !== null && seen === snap) {
    return { count: 0, title: '' }
  }
  return { count: payload.count, title: payload.title }
}
