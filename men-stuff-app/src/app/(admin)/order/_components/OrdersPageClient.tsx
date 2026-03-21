'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { labels, BASE_PATH } from '@/lib/labels'
import type { Order, OrderStatus } from '@/models/order'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

const PAGE_SIZE = 15

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
}

function formatVnd(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)
}

function formatDt(value: string | Date | null) {
  if (!value) return '—'
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

export default function OrdersPageClient() {
  const dict = labels.admin
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total])

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: String(PAGE_SIZE),
      })
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`${BASE_PATH}/api/admin/orders?${params.toString()}`)
      const json = (await res.json()) as {
        data?: Order[]
        total?: number
        error?: string | null
      }
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Không tải được đơn hàng')
      }
      setOrders(json.data ?? [])
      setTotal(json.total ?? 0)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lỗi tải đơn hàng')
      setOrders([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => {
    void fetchOrders()
  }, [fetchOrders])

  const handleStatusChange = async (orderId: string, next: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`${BASE_PATH}/api/admin/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: next }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(json.error || 'Cập nhật thất bại')
      toast.success('Đã cập nhật trạng thái đơn')
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: next } : o)))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lỗi cập nhật')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card/90 shadow-[0_0_50px_-20px_rgba(247,147,26,0.15)] backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">
            <span className="text-gradient-gold">{dict.ordersTitle}</span>
          </CardTitle>
          <CardDescription>{dict.ordersSubtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">{dict.filterStatus}</span>
              <Select
                value={statusFilter || 'all'}
                onValueChange={(v) => {
                  setStatusFilter(v === 'all' ? '' : v)
                  setPage(0)
                }}
              >
                <SelectTrigger className="w-[200px] border-border bg-background/60">
                  <SelectValue placeholder={dict.allStatuses} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{dict.allStatuses}</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s] ?? s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" variant="outline" size="sm" className="border-border" onClick={() => void fetchOrders()}>
              {dict.refresh}
            </Button>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/40">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/30">
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {dict.orderCode}
                  </TableHead>
                  <TableHead className="text-muted-foreground">{dict.receiver}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.phone}</TableHead>
                  <TableHead className="text-right text-muted-foreground">{dict.total}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.paymentMethod}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.orderStatus}</TableHead>
                  <TableHead className="text-muted-foreground">{dict.createdAt}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      {dict.noOrders}
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((o) => (
                    <TableRow key={o.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs text-foreground/90">{o.order_code ?? o.id.slice(0, 8)}</TableCell>
                      <TableCell className="max-w-[140px] truncate">{o.receiver_name ?? '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{o.receiver_phone ?? '—'}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatVnd(o.total_amount)}</TableCell>
                      <TableCell className="text-xs capitalize text-muted-foreground">{o.payment_method ?? '—'}</TableCell>
                      <TableCell>
                        <Select
                          value={(o.status ?? 'pending') as string}
                          disabled={updatingId === o.id}
                          onValueChange={(v) => void handleStatusChange(o.id, v as OrderStatus)}
                        >
                          <SelectTrigger className="h-9 w-[180px] border-border bg-background/60 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {STATUS_LABELS[s] ?? s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDt(o.created_at as unknown as string)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && orders.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
              <p className="font-mono text-xs text-muted-foreground">
                {dict.pageOf.replace('{page}', String(page + 1)).replace('{total}', String(totalPages))} · {total}{' '}
                đơn
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  {dict.prev}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {dict.next}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
