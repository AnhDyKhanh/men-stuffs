import { getSupabaseAdmin } from '@/lib/supabase'
import { getStaffIdByAccountId } from '@/lib/auth-server'
import type { StaffWorkAdminRow } from '@/models/staff-work'
import type { PaginatedData } from '@/types/response.type'

export type GetStaffWorkOptions = {
  page?: number
  size?: number
  status?: string | null
  search?: string | null
  /** Lọc assigned_to = staff hiện tại (cookie account_id). */
  mine?: boolean
  accountIdForMine?: string | null
}

export async function getAllStaffWork(options: GetStaffWorkOptions = {}): Promise<PaginatedData<StaffWorkAdminRow[]>> {
  const { page = 1, size = 20, status, search, mine, accountIdForMine } = options

  const safePage = Math.max(1, Number(page))
  const safeSize = Math.max(1, Math.min(100, Number(size)))
  const from = (safePage - 1) * safeSize
  const to = from + safeSize - 1

  try {
    const supabase = getSupabaseAdmin()

    let staffId: string | null = null
    if (mine && accountIdForMine) {
      staffId = await getStaffIdByAccountId(accountIdForMine)
      if (!staffId) {
        return {
          data: [],
          total: 0,
          error: null,
          message: null,
          status: 200,
        }
      }
    }

    // Không dùng join hint `staff!staff_work_assigned_to_fkey` để tránh lỗi nếu FK chưa được cache/đặt tên khác.
    // Nếu cần full_name, có thể fetch join riêng sau.
    let query = supabase.from('staff_work').select('*', { count: 'exact' })

    if (staffId) {
      query = query.eq('assigned_to', staffId)
    }

    if (status?.trim()) {
      query = query.eq('status', status.trim())
    }

    if (search?.trim()) {
      const raw = search.trim().replace(/[,%]/g, '').replace(/%/g, '')
      const pattern = `%${raw}%`
      query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`)
    }

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)

    if (error) throw error

    const staffWorkRows = (data ?? []) as Array<StaffWorkAdminRow & { assigned_to?: string | null }>

    // Lấy full_name của staff dựa theo assigned_to để render cột "Người được giao".
    const assignedToIds = Array.from(
      new Set(staffWorkRows.map((r) => r.assigned_to).filter((id): id is string => !!id)),
    )

    let staffNameById: Map<string, string | null> = new Map()
    if (assignedToIds.length) {
      const { data: staffRows, error: staffError } = await supabase
        .from('staff')
        .select('id, full_name')
        .in('id', assignedToIds)

      if (staffError) throw staffError

      staffNameById = new Map(
        (staffRows ?? []).map((s: Record<string, unknown>) => [
          String(s.id),
          (s.full_name as string | null) ?? null,
        ]),
      )
    }

    const rows: StaffWorkAdminRow[] = staffWorkRows.map((row) => {
      const assignee_full_name = row.assigned_to ? staffNameById.get(row.assigned_to) ?? null : null
      return {
        ...(row as StaffWorkAdminRow),
        assignee_full_name,
      }
    })

    return {
      data: rows,
      total: count ?? 0,
      error: null,
      message: null,
      status: 200,
    }
  } catch (error: unknown) {
    console.error('[API GET /api/admin/staff-work] exception:', error)
    return {
      data: null,
      total: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch staff work',
      message: null,
      status: 500,
    }
  }
}
