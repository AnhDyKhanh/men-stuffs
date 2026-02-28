import type { Account } from './account'

/**
 * Staff entity (table: staff)
 * One-to-one with account via account_id.
 */
export type StaffRole = 'admin' | 'manager' | 'staff' | string

export type Staff = {
  id: string
  account_id: string | null
  full_name: string | null
  phone: string | null
  role: StaffRole | null
}

export type StaffWithAccount = Staff & {
  account?: Account | null
}
