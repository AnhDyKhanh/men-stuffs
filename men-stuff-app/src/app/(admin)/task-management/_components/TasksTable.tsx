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
import type { StaffWorkAdminRow, StaffWorkStatus } from '@/models/staff-work'
import { TASK_STATUS_OPTIONS, taskTypeLabel } from './taskConstants'

function formatDate(iso: string | Date | null | undefined) {
  if (!iso) return '—'
  const d = typeof iso === 'string' ? new Date(iso) : iso
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

function shortId(id: string | null | undefined) {
  if (!id) return '—'
  return id.length > 8 ? `${id.slice(0, 8)}…` : id
}

type Props = {
  tasks: StaffWorkAdminRow[] | null | undefined
  isLoading: boolean
  onStatusChange: (taskId: string, status: StaffWorkStatus) => void
  updatingId?: string | null
}

export function TasksTable({ tasks, isLoading, onStatusChange, updatingId }: Props) {
  const rows = tasks ?? []

  return (
    <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
      <CardHeader className="border-b border-slate-200 pb-4">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">Danh sách công việc</CardTitle>
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
            <p className="p-8 text-center text-sm text-slate-500">Không có việc nào</p>
          )}
          {!isLoading && rows.length > 0 && (
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1024px]">
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-slate-50">
                    <TableHead className="text-slate-600">Tiêu đề</TableHead>
                    <TableHead className="text-slate-600">Loại</TableHead>
                    <TableHead className="text-slate-600">Người giao</TableHead>
                    <TableHead className="text-slate-600">Mã đơn</TableHead>
                    <TableHead className="text-slate-600">Mô tả</TableHead>
                    <TableHead className="text-slate-600">Ngày tạo</TableHead>
                    <TableHead className="text-slate-600">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((t) => (
                    <TableRow key={t.id} className="border-slate-200 hover:bg-slate-50/80">
                      <TableCell className="max-w-[200px] font-medium text-slate-900">
                        {t.title?.trim() || '—'}
                      </TableCell>
                      <TableCell className="text-xs">{taskTypeLabel(t.task_type)}</TableCell>
                      <TableCell className="max-w-[140px] truncate text-xs">
                        {t.assignee_full_name?.trim() || (t.assigned_to ? shortId(t.assigned_to) : '—')}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{shortId(t.related_order_id)}</TableCell>
                      <TableCell className="max-w-[220px] truncate text-xs text-slate-600">
                        {t.description?.trim() || '—'}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{formatDate(t.created_at as unknown as string)}</TableCell>
                      <TableCell>
                        <Select
                          value={(t.status ?? 'pending') as string}
                          disabled={updatingId === t.id}
                          onValueChange={(v) => onStatusChange(t.id, v as StaffWorkStatus)}
                        >
                          <SelectTrigger className="h-9 border-slate-300 bg-white text-xs text-slate-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TASK_STATUS_OPTIONS.map((opt) => (
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
