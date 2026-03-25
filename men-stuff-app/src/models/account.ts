/**
 * Account entity (table: account)
 * Base auth entity; referenced by customer and staff.
 */
export type AccountStatus = 'active' | 'inactive' | 'suspended'

export type Account = {
  id: string
  email: string
  password: string
  status: AccountStatus | null
  created_at: Date | null
  updated_at: Date | null
}
