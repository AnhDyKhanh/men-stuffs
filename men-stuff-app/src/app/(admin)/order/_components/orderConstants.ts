import type { OrderStatus } from '@/models/order'

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
}

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: ORDER_STATUS_LABELS.pending },
  { value: 'confirmed', label: ORDER_STATUS_LABELS.confirmed },
  { value: 'shipping', label: ORDER_STATUS_LABELS.shipping },
  { value: 'delivered', label: ORDER_STATUS_LABELS.delivered },
  { value: 'cancelled', label: ORDER_STATUS_LABELS.cancelled },
]
