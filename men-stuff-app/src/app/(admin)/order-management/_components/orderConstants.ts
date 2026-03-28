import type { OrderStatus } from '@/models/order'
import { ORDER_STATUS_LABELS as ORDER_STATUS_LABELS_SOURCE } from '@/constants/orderStatus'

export const ORDER_STATUS_LABELS = ORDER_STATUS_LABELS_SOURCE

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: ORDER_STATUS_LABELS.pending },
  { value: 'confirmed', label: ORDER_STATUS_LABELS.confirmed },
  { value: 'ready_for_pickup', label: ORDER_STATUS_LABELS.ready_for_pickup },
  { value: 'picked_up', label: ORDER_STATUS_LABELS.picked_up },
  { value: 'shipping', label: ORDER_STATUS_LABELS.shipping },
  { value: 'delivered', label: ORDER_STATUS_LABELS.delivered },
  { value: 'cancelled', label: ORDER_STATUS_LABELS.cancelled },
]
