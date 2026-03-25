import type { Staff } from './staff'
import type { Order } from './order'

/**
 * StaffWork entity (table: staff_work)
 * Many-to-one with staff (assigned_to, created_by) and order (related_order_id).
 */
export type StaffWorkStatus = 'pending' | 'in_progress' | 'done' | 'cancelled' | string

export type TaskType = 'fulfillment' | 'support' | 'other' | string

export type StaffWork = {
  id: string
  assigned_to: string | null
  created_by: string | null
  related_order_id: string | null
  title: string | null
  description: string | null
  status: StaffWorkStatus | null
  taskType: TaskType | null
  created_at: Date | null
}

export type StaffWorkWithRelations = StaffWork & {
  assignedToStaff?: Staff | null
  createdByStaff?: Staff | null
  relatedOrder?: Order | null
}
