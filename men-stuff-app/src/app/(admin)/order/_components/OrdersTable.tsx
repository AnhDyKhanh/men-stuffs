'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { Order, OrderStatus } from '@/models/order'
import { OrderStatusBadge } from './OrderStatusBadge'
import { ORDER_STATUS_OPTIONS } from './orderConstants'

function formatVnd(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)
}

function formatDate(iso: string | Date | null | undefined) {
  if (!iso) return '—'
  const d = typeof iso === 'string' ? new Date(iso) : iso
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

type Dict = {
  tableTitle: string
  colCode: string
  colCustomer: string
  colPhone: string
  colTotal: string
  colStatus: string
  colPayment: string
  colCreated: string
  colAction: string
  empty: string
  paymentCod: string
  paymentBank: string
  paymentMomo: string
}

const paymentLabel = (m: string | null | undefined, dict: Dict) => {
  if (m === 'cod') return dict.paymentCod
  if (m === 'bank_transfer') return dict.paymentBank
  if (m === 'momo') return dict.paymentMomo
  return m ?? '—'
}

type Props = {
  orders: Order[] | null | undefined
  isLoading: boolean
  dict: Dict
  onStatusChange: (orderId: string, status: OrderStatus) => void
  updatingId?: string | null
}

export function OrdersTable({ orders, isLoading, dict, onStatusChange, updatingId }: Props) {
  const rows = orders ?? []

  return (
    <Card className="admin-shell overflow-hidden border-white/10 bg-card/80 text-card-foreground">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="text-lg font-semibold tracking-tight">
          <span className="text-gradient-gold">{dict.tableTitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {isLoading && (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          )}
          {!isLoading && rows.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">{dict.empty}</p>
          )}
          {!isLoading && rows.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-muted/30">
                  <TableHead className="text-muted-foreground">{dict.colCode}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.colCustomer}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.colPhone}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.colTotal}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.colPayment}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.colCreated}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.colStatus}</TableHead>
                  <TableHead className="w-[180px] text-muted-foreground">{dict.colAction}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((o) => (
                  <TableRow key={o.id} className="border-white/10 hover:bg-muted/20">
                    <TableCell className="font-mono text-xs">{o.order_code ?? o.id.slice(0, 8)}</TableCell>
                    <TableCell className="max-w-[140px] truncate">{o.receiver_name ?? '—'}</TableCell>
                    <TableCell className="font-mono text-xs">{o.receiver_phone ?? '—'}</TableCell>
                    <TableCell className="font-mono text-sm">{formatVnd(o.total_amount)}</TableCell>
                    <TableCell className="text-xs">{paymentLabel(o.payment_method, dict)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(o.created_at as unknown as string)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={(o.status ?? 'pending') as string}
                        disabled={updatingId === o.id}
                        onValueChange={(v) => onStatusChange(o.id, v as OrderStatus)}
                      >
                        <SelectTrigger className="h-9 border-white/10 bg-background/60 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
