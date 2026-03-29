export const STORE_ORDER_FLOW = ['pending', 'confirmed', 'shipping', 'picked_up'] as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Đã nhận đơn',
  confirmed: 'Đang chuẩn bị hàng',
  ready_for_pickup: 'Đã sẵn sàng',
  picked_up: 'Đã nhận hàng',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
}

export const PROCESSING_ORDER_STATUSES = ['pending', 'confirmed', 'ready_for_pickup'] as const

export function getOrderStatusLabel(status: string | null | undefined): string {
  if (!status) return 'Không rõ'
  return ORDER_STATUS_LABELS[status] ?? status
}

export function isProcessingOrder(status: string | null | undefined): boolean {
  if (!status) return false
  return PROCESSING_ORDER_STATUSES.includes(status as (typeof PROCESSING_ORDER_STATUSES)[number])
}

