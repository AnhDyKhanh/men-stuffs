import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/models/order'
import { ORDER_STATUS_LABELS } from './orderConstants'

const variantMap: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'secondary',
  confirmed: 'default',
  shipping: 'outline',
  delivered: 'default',
  cancelled: 'destructive',
}

export function OrderStatusBadge({ status }: { status: OrderStatus | null | undefined }) {
  const s = (status ?? 'pending') as string
  const variant = variantMap[s] ?? 'outline'
  const label = ORDER_STATUS_LABELS[s] ?? s
  return (
    <Badge variant={variant} className="font-mono text-[10px] tracking-wide uppercase">
      {label}
    </Badge>
  )
}
