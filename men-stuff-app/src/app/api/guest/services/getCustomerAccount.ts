
import { getAccountIdFromCookie } from "@/lib/auth"
import { getSupabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function getCustomerAccount() {
  const cookieStore = await cookies()
  const accountId = getAccountIdFromCookie(cookieStore)

  if (!accountId) return {
    data: null,
    error: 'Account ID is required',
    message: 'Account ID is required',
    status: 400
  }

  const { data, error } = await getSupabase()
    .from('customer')
    .select('*')
    .eq('account_id', accountId)
  if (error) throw error
  return data
}

export async function getCurrentCustomerId() {
  const cookieStore = await cookies()
  const accountId = getAccountIdFromCookie(cookieStore)

  if (!accountId) return {
    data: null,
    error: 'Account ID is required',
    message: 'Account ID is required',
    status: 400
  }

  const { data, error } = await getSupabase()
    .from('customer')
    .select('*')
    .eq('account_id', accountId)

  if (error) throw error

  return data?.[0]?.id
}