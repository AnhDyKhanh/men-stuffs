'use client'

import { useCallback, useMemo, useState } from 'react'
import { useAdminStaffWork, useUpdateStaffWorkStatus } from '@/hooks/useAdminStaffWork'
import { labels, BASE_PATH } from '@/lib/labels'
import type { StaffWorkStatus } from '@/models/staff-work'
import { Button } from '@/components/ui/button'
import { TasksToolbar } from './TasksToolbar'
import { TasksTable } from './TasksTable'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 20

export function TasksPageClient() {
  const dict = labels.admin.tasksPage
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [mineOnly, setMineOnly] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchApplied, setSearchApplied] = useState('')

  const query = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      status: statusFilter === 'all' ? null : statusFilter,
      search: searchApplied.trim() || null,
      mine: mineOnly,
    }),
    [page, statusFilter, searchApplied, mineOnly],
  )

  const { data, isLoading, isFetching, refetch } = useAdminStaffWork(query)
  const updateStatus = useUpdateStaffWorkStatus()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const tasks = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleSearch = useCallback(() => {
    setSearchApplied(searchInput)
    setPage(1)
  }, [searchInput])

  const handleStatusFilter = useCallback((v: string) => {
    setStatusFilter(v)
    setPage(1)
  }, [])

  const handleMineOnly = useCallback((v: boolean) => {
    setMineOnly(v)
    setPage(1)
  }, [])

  const onTaskStatusChange = useCallback(
    (taskId: string, status: StaffWorkStatus) => {
      setUpdatingId(taskId)
      updateStatus.mutate(
        { id: taskId, status },
        {
          onSettled: () => setUpdatingId(null),
        },
      )
    },
    [updateStatus],
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

      <TasksToolbar
        statusFilter={statusFilter}
        onStatusChange={handleStatusFilter}
        mineOnly={mineOnly}
        onMineOnlyChange={handleMineOnly}
        search={searchInput}
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
        onRefresh={() => void refetch()}
        isLoading={isFetching}
        dict={{
          filterStatus: dict.filterStatus,
          all: dict.allStatuses,
          mineOnly: dict.mineOnly,
          allTasks: dict.allTasks,
          scope: dict.scope,
          searchPlaceholder: dict.searchPlaceholder,
          search: dict.searchButton,
          refresh: dict.refresh,
        }}
      />

      <TasksTable
        tasks={tasks}
        isLoading={isLoading}
        dict={{
          tableTitle: dict.tableTitle,
          colTitle: dict.colTitle,
          colType: dict.colType,
          colStatus: dict.colStatus,
          colOrder: dict.colOrder,
          colAssignee: dict.colAssignee,
          colDescription: dict.colDescription,
          colCreated: dict.colCreated,
          empty: dict.empty,
        }}
        onStatusChange={onTaskStatusChange}
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
