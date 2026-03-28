import { getSupabaseAdmin } from '@/lib/supabase'

/**
 * PATCH /api/admin/collections/:id — cập nhật tên / mô tả.
 */
export async function updateCollection(
  id: string,
  body: { name?: string; description?: string | null },
): Promise<void> {
  const admin = getSupabaseAdmin()
  const patch: Record<string, string | null> = {}
  if (body.name !== undefined) patch.name = body.name.trim()
  if (body.description !== undefined) patch.description = body.description?.trim() || null
  const { error } = await admin.from('collection').update(patch).eq('id', id)
  if (error) throw error
}

/**
 * DELETE /api/admin/collections/:id — xóa collection (cascade item nếu DB cấu hình FK).
 */
export async function deleteCollection(id: string): Promise<void> {
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('collection').delete().eq('id', id)
  if (error) throw error
}
