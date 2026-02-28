/**
 * Auth helpers that query DB: check staff by account_id.
 * Used by middleware (Edge) and login API. Do not import from client.
 */
import { getSupabase } from '@/lib/supabase'

const STAFF_TABLE = 'staff'

/**
 * Returns true if the given account_id has a row in staff (user is staff/admin).
 */
export async function isStaffByAccountId(accountId: string): Promise<boolean> {
  if (!accountId) return false
  const { data, error } = await getSupabase()
    .from(STAFF_TABLE)
    .select('id')
    .eq('account_id', accountId)
    .maybeSingle()
  return !error && data != null
}
