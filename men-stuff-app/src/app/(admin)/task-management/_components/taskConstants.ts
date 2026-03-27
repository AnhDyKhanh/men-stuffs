import type { StaffWorkStatus } from '@/models/staff-work'
import type { TaskType } from '@/models/staff-work'

export const TASK_STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  in_progress: 'Đang làm',
  done: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

export const TASK_STATUS_OPTIONS: { value: StaffWorkStatus; label: string }[] = [
  { value: 'pending', label: TASK_STATUS_LABELS.pending },
  { value: 'in_progress', label: TASK_STATUS_LABELS.in_progress },
  { value: 'done', label: TASK_STATUS_LABELS.done },
  { value: 'cancelled', label: TASK_STATUS_LABELS.cancelled },
]

export const TASK_TYPE_LABELS: Record<string, string> = {
  fulfillment: 'Giao hàng / xử lý đơn',
  support: 'Hỗ trợ',
  other: 'Khác',
}

export function taskTypeLabel(t: TaskType | string | null | undefined): string {
  if (t == null || t === '') return '—'
  return TASK_TYPE_LABELS[t] ?? String(t)
}
