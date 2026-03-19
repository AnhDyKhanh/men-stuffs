'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Order } from '@/app/_models/order'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BASE_PATH, labels } from '@/lib/labels'

type OrderStatusFilter = 'all' | 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'

function formatCurrency(value: number | null | undefined) {
  const safe = typeof value === 'number' && Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(safe)
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return '-'
  const date = typeof value === 'string' ? new Date(value) : value
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('vi-VN')
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'

function statusBadgeVariant(status: string | null | undefined): BadgeVariant {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'confirmed':
      return 'default'
    case 'shipping':
      return 'outline'
    case 'delivered':
      return 'ghost'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

function normalizeOrder(input: unknown): Order {
  const o = input as Partial<Order> & { created_at?: Date | string | null }
  return {
    id: String(o.id ?? ''),
    customer_id: o.customer_id ?? null,
    cart_id: o.cart_id ?? null,
    total_amount: o.total_amount ?? null,
    status: (o.status ?? null) as Order['status'],
    order_code: o.order_code ?? null,
    payment_method: o.payment_method ?? null,
    payment_status: o.payment_status ?? null,
    shipping_address: o.shipping_address ?? null,
    receiver_name: o.receiver_name ?? null,
    receiver_phone: o.receiver_phone ?? null,
    created_at:
      typeof o.created_at === 'string' ? new Date(o.created_at) : (o.created_at ?? null),
  }
}

function getPlaceholderOrders(): Order[] {
  const now = new Date()
  return [
    {
      id: 'ord_1',
      customer_id: null,
      cart_id: null,
      total_amount: 1290000,
      status: 'pending',
      order_code: 'MS-0001',
      payment_method: 'cod',
      payment_status: 'pending',
      shipping_address: '12 Trần Phú, Hà Nội',
      receiver_name: 'Nguyễn Văn A',
      receiver_phone: '0901 234 567',
      created_at: new Date(now.getTime() - 1000 * 60 * 30),
    },
    {
      id: 'ord_2',
      customer_id: null,
      cart_id: null,
      total_amount: 850000,
      status: 'pending',
      order_code: 'MS-0002',
      payment_method: 'momo',
      payment_status: 'paid',
      shipping_address: '33 Nguyễn Du, Hải Phòng',
      receiver_name: 'Trần Thị B',
      receiver_phone: '0902 111 222',
      created_at: new Date(now.getTime() - 1000 * 60 * 75),
    },
    {
      id: 'ord_3',
      customer_id: null,
      cart_id: null,
      total_amount: 2190000,
      status: 'confirmed',
      order_code: 'MS-0003',
      payment_method: 'bank_transfer',
      payment_status: 'paid',
      shipping_address: '5 Lê Lợi, Đà Nẵng',
      receiver_name: 'Lê Văn C',
      receiver_phone: '0903 777 888',
      created_at: new Date(now.getTime() - 1000 * 60 * 180),
    },
    {
      id: 'ord_4',
      customer_id: null,
      cart_id: null,
      total_amount: 560000,
      status: 'shipping',
      order_code: 'MS-0004',
      payment_method: 'cod',
      payment_status: 'paid',
      shipping_address: '88 Võ Văn Ngân, TP.HCM',
      receiver_name: 'Phạm D',
      receiver_phone: '0904 555 666',
      created_at: new Date(now.getTime() - 1000 * 60 * 260),
    },
    {
      id: 'ord_5',
      customer_id: null,
      cart_id: null,
      total_amount: 1750000,
      status: 'delivered',
      order_code: 'MS-0005',
      payment_method: 'momo',
      payment_status: 'paid',
      shipping_address: '19 Điện Biên Phủ, Cần Thơ',
      receiver_name: 'Bùi E',
      receiver_phone: '0905 222 333',
      created_at: new Date(now.getTime() - 1000 * 60 * 460),
    },
    {
      id: 'ord_6',
      customer_id: null,
      cart_id: null,
      total_amount: 320000,
      status: 'cancelled',
      order_code: 'MS-0006',
      payment_method: 'cod',
      payment_status: 'failed',
      shipping_address: 'TBA',
      receiver_name: 'Trương F',
      receiver_phone: '0906 111 000',
      created_at: new Date(now.getTime() - 1000 * 60 * 600),
    },
  ].map(normalizeOrder)
}

export default function OrdersReceivingClient() {
  const dict = labels.admin

  const [orders, setOrders] = useState<Order[]>(() => getPlaceholderOrders())
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('pending')

  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      // TODO (API): tạo endpoint GET /api/admin/orders?status=pending
      // Trả về shape { data: Order[] }
      const url =
        statusFilter === 'all'
          ? '/api/admin/orders'
          : `/api/admin/orders?status=${encodeURIComponent(statusFilter)}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Fetch orders failed: ${res.status}`)
      const json = (await res.json()) as { data?: unknown }
      const list = (Array.isArray(json?.data) ? json.data : []) as unknown[]
      setOrders(list.map(normalizeOrder))
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Failed to fetch orders')
      // Fallback demo data so UI still usable while API đang làm
      setOrders(getPlaceholderOrders())
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesStatus =
        statusFilter === 'all' ? true : String(o.status ?? '') === statusFilter
      const matchesSearch = !q
        ? true
        : [o.order_code, o.receiver_name, o.receiver_phone]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
      return matchesStatus && matchesSearch
    })
  }, [orders, search, statusFilter])

  function openOrder(order: Order) {
    setSelectedOrder(order)
    setSheetOpen(true)
  }

  async function handleReceiveSelected() {
    if (!selectedOrder) return
    // Only allow "receive" for pending orders.
    if (selectedOrder.status !== 'pending') return

    try {
      // TODO (API): tạo endpoint
      // POST /api/admin/orders/:id/receive
      // Backend đọc `account_id` cookie -> tìm staff -> insert staff_work + cập nhật orders.status='confirmed'
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/receive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // payload (tuỳ bạn) nếu cần thêm taskType/notes
      })
      if (!res.ok) throw new Error(`Receive order failed: ${res.status}`)

      // optimistic UI: change status locally
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: 'confirmed' } : o)),
      )
      setSelectedOrder((prev) => (prev ? { ...prev, status: 'confirmed' } : prev))
      setSheetOpen(false)
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Failed to receive order')
    }
  }

  const selectedStatus = selectedOrder?.status ?? null
  const canReceive = selectedStatus === 'pending'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Nhận đơn hàng
          </h1>
          <p className="text-sm text-muted-foreground">
            Chọn một đơn để xem chi tiết và thao tác nhận xử lý.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => void loadOrders()} disabled={isLoading}>
            {isLoading ? 'Đang tải...' : 'Làm mới'}
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href={`${BASE_PATH}/dashboard`}>Quay lại</Link>
          </Button>
        </div>
      </div>

      {fetchError && (
        <Card>
          <CardContent className="py-4 text-sm text-destructive">
            {fetchError}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="gap-3">
          <CardTitle className="text-lg">Danh sách đơn hàng</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 space-y-1">
              <Label htmlFor="order-search">Tìm theo mã/khách</Label>
              <Input
                id="order-search"
                placeholder="VD: MS-0001, Nguyễn Văn A..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-64 space-y-1">
              <Label htmlFor="status-filter">Trạng thái</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatusFilter)}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="confirmed">Đã nhận</SelectItem>
                  <SelectItem value="shipping">Đang giao</SelectItem>
                  <SelectItem value="delivered">Đã giao</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <p className="text-sm text-muted-foreground">Không có đơn nào phù hợp.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Tổng</TableHead>
                  <TableHead className="text-left">Ngày</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">
                      {o.order_code ?? '-'}
                      <div className="text-xs text-muted-foreground">ID: {o.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{o.receiver_name ?? '-'}</div>
                      <div className="text-xs text-muted-foreground">{o.receiver_phone ?? '-'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(o.status)}>
                        {o.status ?? '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(o.total_amount)}
                    </TableCell>
                    <TableCell className="text-left text-muted-foreground">
                      {formatDate(o.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={o.status === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => openOrder(o)}
                      >
                        {o.status === 'pending' ? 'Nhận' : 'Xem'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Chi tiết đơn</SheetTitle>
            <SheetDescription>Thông tin khách hàng, giao hàng và thao tác nhận đơn.</SheetDescription>
          </SheetHeader>

          <Separator className="my-4" />

          {selectedOrder ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Mã đơn</div>
                    <div className="text-lg font-semibold">{selectedOrder.order_code ?? '-'}</div>
                  </div>
                  <Badge variant={statusBadgeVariant(selectedOrder.status)}>
                    {selectedOrder.status ?? '-'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Khách nhận</div>
                    <div className="font-medium">{selectedOrder.receiver_name ?? '-'}</div>
                    <div className="text-sm text-muted-foreground">{selectedOrder.receiver_phone ?? '-'}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Địa chỉ giao</div>
                    <div className="font-medium">{selectedOrder.shipping_address ?? '-'}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Thanh toán</div>
                      <div className="font-medium">{selectedOrder.payment_method ?? '-'}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedOrder.payment_status ?? '-'}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Tổng</div>
                      <div className="text-lg font-semibold">{formatCurrency(selectedOrder.total_amount)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(selectedOrder.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  disabled={!canReceive}
                  onClick={() => void handleReceiveSelected()}
                >
                  {canReceive ? 'Nhận đơn' : 'Đơn không ở trạng thái chờ xử lý'}
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setSheetOpen(false)}
                >
                  Đóng
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                {dict.pendingOrders}: hiển thị demo khi chưa có API.
              </p>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">Chưa chọn đơn.</div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

