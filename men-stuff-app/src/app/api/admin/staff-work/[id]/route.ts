import { NextResponse } from 'next/server'
import { updateStaffWorkStatus } from '../services/updateStaffWorkStatus'
import type { StaffWorkStatus } from '@/models/staff-work'

type RouteContext = { params: Promise<{ id: string }> }

/**
 * PATCH /api/admin/staff-work/:id
 * Body: { status: StaffWorkStatus }
 */
export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  try {
    const body = await request.json()
    const status = body?.status as StaffWorkStatus
    const result = await updateStaffWorkStatus(id, status)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}
