import type { Account } from './account'

/**
 * Customer entity (table: customer)
 * One-to-one with account via account_id.
 */
export type Customer = {
  id: string
  account_id: string | null
  full_name: string | null
  phone: string | null
  point: number | null
}

export type CustomerWithAccount = Customer & {
  account?: Account | null
}
