'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TASK_STATUS_OPTIONS } from './taskConstants'
import { Search, RefreshCw } from 'lucide-react'

type Props = {
  statusFilter: string
  onStatusChange: (v: string) => void
  mineOnly: boolean
  onMineOnlyChange: (v: boolean) => void
  search: string
  onSearchChange: (v: string) => void
  onSearch: () => void
  onRefresh: () => void
  isLoading?: boolean
  dict: {
    filterStatus: string
    all: string
    mineOnly: string
    allTasks: string
    scope: string
    searchPlaceholder: string
    search: string
    refresh: string
  }
}

export function TasksToolbar({
  statusFilter,
  onStatusChange,
  mineOnly,
  onMineOnlyChange,
  search,
  onSearchChange,
  onSearch,
  onRefresh,
  isLoading,
  dict,
}: Props) {
  return (
    <Card className="border-slate-200 bg-white text-slate-900 shadow-sm">
      <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Label htmlFor="task-status-filter" className="font-mono text-[11px] tracking-widest text-slate-500 uppercase">
            {dict.filterStatus}
          </Label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger
              id="task-status-filter"
              className="w-full min-w-[200px] border-slate-300 bg-white text-slate-900 sm:w-[240px]"
            >
              <SelectValue placeholder={dict.all} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.all}</SelectItem>
              {TASK_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-scope" className="font-mono text-[11px] tracking-widest text-slate-500 uppercase">
            {dict.scope}
          </Label>
          <Select value={mineOnly ? 'mine' : 'all'} onValueChange={(v) => onMineOnlyChange(v === 'mine')}>
            <SelectTrigger
              id="task-scope"
              className="w-full min-w-[200px] border-slate-300 bg-white text-slate-900 sm:w-[240px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.allTasks}</SelectItem>
              <SelectItem value="mine">{dict.mineOnly}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-1 flex-col gap-2 lg:max-w-md">
          <Label htmlFor="task-search" className="font-mono text-[11px] tracking-widest text-slate-500 uppercase">
            {dict.search}
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" aria-hidden />
              <Input
                id="task-search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                placeholder={dict.searchPlaceholder}
                className="border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={onSearch}
              className="shrink-0 border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              {dict.search}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="shrink-0 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              aria-label={dict.refresh}
            >
              <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
