/**
 * Supabase clients for database and storage (public schema).
 * - getSupabase(): anon key, for normal read/write (respects RLS).
 * - getSupabaseAdmin(): service role key, server-only, bypasses RLS (Storage, admin ops).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null
let _adminClient: SupabaseClient | null = null

/**
 * Get Supabase client (public schema) with anon key.
 * Throws if NEXT_PUBLIC_SUPABASE_URL and anon key are not set.
 */
export function getSupabase(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'Missing Supabase env. Add NEXT_PUBLIC_SUPABASE_URL and anon key to .env.local',
    )
  }
  _client = createClient(url, key, { db: { schema: 'public' } })
  return _client
}

/**
 * Get Supabase admin client (service role). Server-only.
 * Bypasses RLS – use for Storage uploads and admin DB ops.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. Add to .env.local (server-only).',
    )
  }
  _adminClient = createClient(url, key, { db: { schema: 'public' } })
  return _adminClient
}
