/**
 * Lỗi Postgres/PostgREST khi bảng chưa tồn tại (chạy script SQL trên Supabase).
 */
export function isMissingTableError(err: unknown): boolean {
  const code = (err as { code?: string })?.code
  if (code === '42P01' || code === 'PGRST205') return true
  const msg = err instanceof Error ? err.message : String(err)
  return /does not exist|Could not find the table|relation/i.test(msg)
}
