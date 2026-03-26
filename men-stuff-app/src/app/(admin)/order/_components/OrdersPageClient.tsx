'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdminOrders'
import { labels, BASE_PATH } from '@/lib/labels'
import type { Staff } from '@/models/staff'
import { API_ROUTES } from '@/constants/apiRouter'
import type { OrderStatus } from '@/models/order'
import { Button } from '@/components/ui/button'
import { OrdersToolbar } from './OrdersToolbar'
import { OrdersTable } from './OrdersTable'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 20

export function OrdersPageClient() {
  const dict = labels.admin.ordersPage
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchInput, setSearchInput] = useState('')
  const [searchApplied, setSearchApplied] = useState('')
  const [staffOptions, setStaffOptions] = useState<Staff[] | null>(null)
  const [isStaffLoading, setIsStaffLoading] = useState(false)

  const query = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      status: statusFilter === 'all' ? null : statusFilter,
      search: searchApplied.trim() || null,
    }),
    [page, statusFilter, searchApplied],
  )

  const { data, isLoading, isFetching, refetch } = useAdminOrders(query)
  const updateStatus = useUpdateOrderStatus()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const orders = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    let cancelled = false
    async function loadStaff() {
      setIsStaffLoading(true)
      try {
        const res = await fetch(API_ROUTES.STAFF.GET_ALL, { cache: 'no-store' })
        const payload = (await res.json().catch(() => null)) as { data?: Staff[]; error?: string } | null
        if (!res.ok) throw new Error(payload?.error || 'Không tải được nhân viên')
        if (!cancelled) setStaffOptions(payload?.data ?? [])
      } catch {
        if (!cancelled) setStaffOptions([])
      } finally {
        if (!cancelled) setIsStaffLoading(false)
      }
    }
    void loadStaff()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSearch = useCallback(() => {
    setSearchApplied(searchInput)
    setPage(1)
  }, [searchInput])

  const handleStatusFilter = useCallback((v: string) => {
    setStatusFilter(v)
    setPage(1)
  }, [])

  const onOrderStatusChange = useCallback(
    (orderId: string, status: OrderStatus) => {
      setUpdatingId(orderId)
      updateStatus.mutate(
        { id: orderId, status },
        {
          onSettled: () => setUpdatingId(null),
        },
      )
    },
    [updateStatus],
  )

  const handleAssignStaff = useCallback(
    async (orderId: string, staffId: string) => {
      const res = await fetch(API_ROUTES.STAFF_WORK.ASSIGN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, staffId }),
      })
      const payload = (await res.json().catch(() => null)) as { error?: string; ok?: boolean } | null
      if (!res.ok || payload?.ok !== true) {
        throw new Error(payload?.error || 'Gán nhân viên thất bại')
      }
      await refetch()
    },
    [refetch],
  )

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-slate-500 uppercase">{dict.kicker}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{dict.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{dict.subtitle}</p>
          </div>
          <Button asChild variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
            <Link href={`${BASE_PATH}/dashboard`}>
              <ChevronLeft className="mr-1 size-4" />
              {dict.backDashboard}
            </Link>
          </Button>
        </div>
      </div>

      <OrdersToolbar
        statusFilter={statusFilter}
        onStatusChange={handleStatusFilter}
        search={searchInput}
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={() => void refetch()}
        isLoading={isFetching}
        dict={{
          filterStatus: dict.filterStatus,
          all: dict.allStatuses,
          searchPlaceholder: dict.searchPlaceholder,
          search: dict.searchButton,
          refresh: dict.refresh,
        }}
      />

      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        staffOptions={isStaffLoading ? null : staffOptions}
        dict={{
          tableTitle: dict.tableTitle,
          colCode: dict.colCode,
          colCustomer: dict.colCustomer,
          colPhone: dict.colPhone,
          colTotal: dict.colTotal,
          colStatus: dict.colStatus,
          colPayment: dict.colPayment,
          colCreated: dict.colCreated,
          colAction: dict.colAction,
          empty: dict.empty,
          paymentCod: dict.paymentCod,
          paymentBank: dict.paymentBank,
          paymentMomo: dict.paymentMomo,
        }}
        onStatusChange={onOrderStatusChange}
        onAssignStaff={handleAssignStaff}
        updatingId={updatingId}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="font-mono text-xs text-slate-600">
            {dict.pageInfo
              .replace(
                '{from}',
                String(total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1),
              )
              .replace('{to}', String(Math.min(page * PAGE_SIZE, total)))
              .replace('{total}', String(total))}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="flex items-center px-2 font-mono text-xs text-slate-600">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
