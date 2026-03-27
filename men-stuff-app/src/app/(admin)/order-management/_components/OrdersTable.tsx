'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { API_ROUTES } from '@/constants/apiRouter'
import type { Order, OrderStatus } from '@/models/order'
import type { Staff } from '@/models/staff'
import { useState } from 'react'
import { toast } from 'sonner'
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

type Props = {
  orders: Order[] | null | undefined
  isLoading: boolean
  onStatusChange: (orderId: string, status: OrderStatus) => void
  staffOptions: Staff[] | null | undefined
  onAssignStaff: (orderId: string, staffId: string) => Promise<void>
  updatingId?: string | null
}

type OrderDetailItem = {
  id: string
  quantity: number
  price_at_time: number
  product: {
    id: string
    name: string
    origin_image: string | null
  } | null
}

type OrderDetailData = {
  id: string
  order_code: string | null
  receiver_name: string | null
  receiver_phone: string | null
  shipping_address: string | null
  total_amount: number | null
  status: string | null
  created_at: string | null
  items: OrderDetailItem[]
}

export function OrdersTable({
  orders,
  isLoading,
  onStatusChange,
  staffOptions,
  onAssignStaff,
  updatingId,
}: Props) {
  const rows = orders ?? []
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [detail, setDetail] = useState<OrderDetailData | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedStaffId, setSelectedStaffId] = useState<string>('')
  const [isAssigningStaff, setIsAssigningStaff] = useState(false)

  const handleOpenDetail = async (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsDetailOpen(true)
    setIsDetailLoading(true)
    setDetailError(null)
    setDetail(null)
    setSelectedStaffId('')

    try {
      const res = await fetch(API_ROUTES.ORDERS.GET_DETAIL(orderId), { cache: 'no-store' })
      const payload = (await res.json().catch(() => null)) as { data?: OrderDetailData; error?: string } | null
      if (!res.ok || !payload?.data) {
        throw new Error(payload?.error || 'Không tải được chi tiết đơn hàng')
      }
      if (payload.data.id === orderId) {
        setDetail(payload.data)
      } else {
        throw new Error('Dữ liệu chi tiết không khớp đơn hàng đang chọn')
      }
    } catch (error: unknown) {
      setDetailError(error instanceof Error ? error.message : 'Không tải được chi tiết đơn hàng')
    } finally {
      setIsDetailLoading(false)
    }
  }

  const handleAssignStaff = async () => {
    if (!detail || selectedOrderId !== detail.id) return
    if (!selectedStaffId) {
      toast.error('Vui lòng chọn nhân viên')
      return
    }

    const staff = staffOptions?.find((s) => s.id === selectedStaffId)
    if (!staff) {
      toast.error('Không tìm thấy nhân viên đã chọn')
      return
    }

    try {
      setIsAssigningStaff(true)
      await onAssignStaff(detail.id, selectedStaffId)
      toast.success(`Đã giao cho ${staff.full_name ?? staff.id} cho đơn ${detail.order_code ?? detail.id.slice(0, 8)}`)
      setIsDetailOpen(false)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gán staff thất bại'
      toast.error(msg)
    } finally {
      setIsAssigningStaff(false)
    }
  }

  return (
    <>
      <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
        <CardHeader className="border-b border-slate-200 pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">
            Danh sách đơn hàng
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
              <p className="p-8 text-center text-sm text-slate-500">Không có đơn hàng</p>
            )}
            {!isLoading && rows.length > 0 && (
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow className="border-slate-200 hover:bg-slate-50">
                      <TableHead className="text-slate-600">Mã đơn</TableHead>
                      <TableHead className="text-slate-600">Khách hàng</TableHead>
                      <TableHead className="text-slate-600">SĐT</TableHead>
                      <TableHead className="text-slate-600">Tổng tiền</TableHead>
                      <TableHead className="text-slate-600">Phương thức thanh toán</TableHead>
                      <TableHead className="text-slate-600">Địa chỉ nhận</TableHead>
                      <TableHead className="text-slate-600">Thời gian</TableHead>
                      <TableHead className="text-slate-600">Trạng thái</TableHead>
                      <TableHead className="text-slate-600">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((o) => (
                      <TableRow key={o.id} className="border-slate-200 hover:bg-slate-50/80">
                        <TableCell className="font-mono text-xs">{o.order_code ?? o.id.slice(0, 8)}</TableCell>
                        <TableCell className="max-w-[140px] truncate">{o.receiver_name ?? '—'}</TableCell>
                        <TableCell className="font-mono text-xs">{o.receiver_phone ?? '—'}</TableCell>
                        <TableCell className="font-mono text-sm">{formatVnd(o.total_amount)}</TableCell>
                        <TableCell className="text-xs">{o.payment_method ?? '—'}</TableCell>
                        <TableCell className="text-xs">{o.shipping_address ?? '—'}</TableCell>
                        <TableCell className="text-xs text-slate-500">{formatDate(o.created_at as unknown as string)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={(o.status ?? 'pending') as string}
                              disabled={updatingId === o.id}
                              onValueChange={(v) => onStatusChange(o.id, v as OrderStatus)}
                            >
                              <SelectTrigger className="h-9 border-slate-300 bg-white text-xs text-slate-900">
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
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => void handleOpenDetail(o.id)}>
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-h-[200vh] border-slate-200 bg-white text-slate-900 sm:max-w-2xl p-4">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>

          {isDetailLoading && <p className="text-sm text-slate-600">Đang tải chi tiết...</p>}
          {!isDetailLoading && detailError && <p className="text-sm text-red-600">{detailError}</p>}

          {!isDetailLoading && !detailError && detail && selectedOrderId === detail.id && (
            <div className="space-y-4">
              <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-medium text-slate-700">Mã đơn:</span> {detail.order_code ?? detail.id.slice(0, 8)}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Khách hàng:</span> {detail.receiver_name ?? '—'}
                </p>
                <p>
                  <span className="font-medium text-slate-700">SĐT:</span> {detail.receiver_phone ?? '—'}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Tổng tiền:</span> {formatVnd(detail.total_amount)}
                </p>
                <p className="sm:col-span-2">
                  <span className="font-medium text-slate-700">Địa chỉ nhận:</span> {detail.shipping_address ?? '—'}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-800">Danh sách sản phẩm</p>
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <Table className="min-w-[640px]">
                    <TableHeader>
                      <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
                        <TableHead className="text-slate-600">Sản phẩm</TableHead>
                        <TableHead className="text-slate-600">Số lượng</TableHead>
                        <TableHead className="text-slate-600">Đơn giá</TableHead>
                        <TableHead className="text-slate-600">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-sm text-slate-500">
                            Không có sản phẩm trong đơn
                          </TableCell>
                        </TableRow>
                      )}
                      {detail.items.map((item) => (
                        <TableRow key={item.id} className="border-slate-200">
                          <TableCell className="text-sm">{item.product?.name ?? 'Sản phẩm đã xóa'}</TableCell>
                          <TableCell className="text-sm">{item.quantity}</TableCell>
                          <TableCell className="text-sm">{formatVnd(item.price_at_time)}</TableCell>
                          <TableCell className="text-sm">{formatVnd(item.price_at_time * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Chọn nhân viên</p>
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId} disabled={isAssigningStaff}>
                  <SelectTrigger className="border-slate-300 bg-white text-slate-900">
                    <SelectValue placeholder="Chọn staff..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(staffOptions ?? []).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.full_name ?? s.id} {s.phone ? `- ${s.phone}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              className="bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => void handleAssignStaff()}
              disabled={isAssigningStaff}
            >
              Thêm người giao hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
