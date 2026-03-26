'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES } from '@/constants/apiRouter'
import type { StaffWorkAdminRow, StaffWorkStatus } from '@/models/staff-work'
import type { PaginatedData } from '@/types/response.type'
import { toast } from 'sonner'

export type AdminStaffWorkQuery = {
  page?: number
  size?: number
  status?: string | null
  search?: string | null
  mine?: boolean
}

function buildStaffWorkQueryString(q: AdminStaffWorkQuery): string {
  const params = new URLSearchParams({
    page: String(q.page ?? 1),
    size: String(q.size ?? 20),
  })
  if (q.status?.trim()) params.set('status', q.status.trim())
  if (q.search?.trim()) params.set('search', q.search.trim())
  if (q.mine) params.set('mine', '1')
  return params.toString()
}

async function fetchStaffWork(q: AdminStaffWorkQuery): Promise<PaginatedData<StaffWorkAdminRow[]>> {
  const qs = buildStaffWorkQueryString(q)
  const res = await fetch(`${API_ROUTES.STAFF_WORK.GET_ALL}?${qs}`, { cache: 'no-store' })
  const payload = (await res.json()) as PaginatedData<StaffWorkAdminRow[]>
  if (!res.ok) throw new Error(payload?.error ?? 'Không tải được danh sách công việc')
  if (payload.data === null) throw new Error(payload.error ?? 'Không tải được danh sách công việc')
  return payload
}

export function useAdminStaffWork(q: AdminStaffWorkQuery) {
  return useQuery({
    queryKey: ['@admin-staff-work', q.page, q.size, q.status, q.search, q.mine],
    queryFn: () => fetchStaffWork(q),
    placeholderData: (prev) => prev,
  })
}

export function useUpdateStaffWorkStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StaffWorkStatus }) => {
      const res = await fetch(API_ROUTES.STAFF_WORK.PATCH_STATUS(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Cập nhật thất bại')
      return data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['@admin-staff-work'] })
      toast.success('Đã cập nhật trạng thái công việc')
    },
    onError: (e: Error) => {
      toast.error(e.message || 'Có lỗi xảy ra')
    },
  })
}
