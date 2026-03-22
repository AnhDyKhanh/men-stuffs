'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ORDER_STATUS_OPTIONS } from './orderConstants'
import { Search, RefreshCw } from 'lucide-react'

type Props = {
  statusFilter: string
  onStatusChange: (v: string) => void
  search: string
  onSearchChange: (v: string) => void
  onSearch: () => void
  onRefresh: () => void
  isLoading?: boolean
  dict: {
    filterStatus: string
    all: string
    searchPlaceholder: string
    search: string
    refresh: string
  }
}

export function OrdersToolbar({
  statusFilter,
  onStatusChange,
  search,
  onSearchChange,
  onSearch,
  onRefresh,
  isLoading,
  dict,
}: Props) {
  return (
    <Card className="admin-shell border-white/10 bg-card/80 text-card-foreground shadow-glow-orange/20">
      <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Label htmlFor="order-status-filter" className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            {dict.filterStatus}
          </Label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger id="order-status-filter" className="w-full min-w-[200px] border-white/10 bg-background/60 sm:w-[240px]">
              <SelectValue placeholder={dict.all} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.all}</SelectItem>
              {ORDER_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-1 flex-col gap-2 sm:max-w-md">
          <Label htmlFor="order-search" className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            {dict.search}
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="order-search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                placeholder={dict.searchPlaceholder}
                className="border-white/10 bg-background/60 pl-10"
              />
            </div>
            <Button type="button" variant="secondary" onClick={onSearch} className="shrink-0 border border-white/10">
              {dict.search}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="shrink-0 border-white/10"
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
