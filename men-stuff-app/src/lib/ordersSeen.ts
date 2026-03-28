import { isProcessingOrder } from '@/constants/orderStatus'

/**
 * Snapshot các đơn **đang xử lý** đã xem: khớp thì ẩn chấm đỏ (header / chatbot / menu).
 */
export const ORDERS_SEEN_STORAGE_KEY = 'men_stuffs_orders_seen_v1'
export const ORDERS_SEEN_EVENT = 'men-stuffs-orders-seen'

export function computeOrdersSnapshot(orders: { id: string; status: string | null }[]): string {
  return [...orders]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((o) => `${o.id}:${o.status ?? ''}`)
    .join('|')
}

export function readSeenSnapshot(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(ORDERS_SEEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function writeSeenSnapshot(snapshot: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ORDERS_SEEN_STORAGE_KEY, snapshot)
  } catch {
    /* ignore */
  }
}

export function notifyOrdersSeenUpdated(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(ORDERS_SEEN_EVENT))
}

export function markOrdersSnapshotSeen(orders: { id: string; status: string | null }[]): void {
  const processing = orders.filter((o) => isProcessingOrder(o.status))
  writeSeenSnapshot(computeOrdersSnapshot(processing))
  notifyOrdersSeenUpdated()
}
