import { getSupabaseAdmin } from '@/lib/supabase'
import type { StaffWorkStatus } from '@/models/staff-work'

const ALLOWED: StaffWorkStatus[] = ['pending', 'in_progress', 'done', 'cancelled']

export async function updateStaffWorkStatus(
  workId: string,
  status: StaffWorkStatus,
): Promise<{ ok: boolean; error: string | null }> {
  if (!workId?.trim()) {
    return { ok: false, error: 'Thiếu mã công việc' }
  }
  if (!ALLOWED.includes(status)) {
    return { ok: false, error: 'Trạng thái không hợp lệ' }
  }

  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('staff_work').update({ status }).eq('id', workId)

    if (error) throw error
    return { ok: true, error: null }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Cập nhật thất bại'
    return { ok: false, error: msg }
  }
}
