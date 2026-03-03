/**
 * Auth helpers: check staff by account_id (from cookie, UUID from public.account).
 * Server-only. Do not import from client.
 */
import { getSupabase } from '@/lib/supabase'

const STAFF_TABLE = 'staff'

/**
 * Returns true if the given account_id has a row in staff (user is admin).
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
