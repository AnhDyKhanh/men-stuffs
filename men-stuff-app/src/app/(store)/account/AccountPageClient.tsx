'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import LogoutButton from '@/components/shared/LogoutButton'
import { useGetCustomerAccountInfor } from '@/hooks/getCustomerAccountInfor'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { API_ROUTES } from '@/constants/apiRouter'
import { markOrdersSnapshotSeen } from '@/lib/ordersSeen'
import { Award, Package, Phone, Receipt, Settings, User } from 'lucide-react'
import ProcessingOrdersBadge from '@/app/(store)/_components/ProcessingOrdersBadge'
import AccountOrdersPanel from '@/app/(store)/account/_components/AccountOrdersPanel'
import AccountPurchaseHistoryPanel from '@/app/(store)/account/_components/AccountPurchaseHistoryPanel'

type Tab = 'profile' | 'orders' | 'history' | 'settings'

function tabFromSearchParams(tabParam: string | null): Tab {
  if (tabParam === 'orders') return 'orders'
  if (tabParam === 'history') return 'history'
  if (tabParam === 'settings') return 'settings'
  return 'profile'
}

export default function AccountPageClient() {
  const { data: response, isLoading } = useGetCustomerAccountInfor()
  const customer = response?.data
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const tabFromUrl = tabFromSearchParams(searchParams.get('tab'))
  const [tab, setTab] = useState<Tab>(tabFromUrl)

  useEffect(() => {
    setTab(tabFromUrl)
  }, [tabFromUrl])

  const goTab = useCallback(
    (next: Tab) => {
      setTab(next)
      const q = next === 'profile' ? '' : `?tab=${next}`
      router.replace(`${pathname}${q}`, { scroll: false })
    },
    [pathname, router],
  )

  useEffect(() => {
    if (tab !== 'orders' && tab !== 'history') return
    let cancelled = false
    void (async () => {
      const res = await fetch(API_ROUTES.GUEST.ORDERS, { cache: 'no-store', credentials: 'include' })
      if (!res.ok || cancelled) return
      const json = (await res.json()) as {
        data?: { orders?: Array<{ id: string; status: string | null }> }
      }
      const orders = json?.data?.orders ?? []
      markOrdersSnapshotSeen(orders)
    })()
    return () => {
      cancelled = true
    }
  }, [tab])

  if (isLoading) {
    return (
      <div className="container mx-auto animate-pulse px-4 py-12">
        <div className="bg-muted mx-auto mb-8 h-32 w-32 rounded-full" />
        <div className="bg-muted mx-auto mb-4 h-8 w-48" />
        <div className="bg-muted mx-auto h-4 w-64" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 flex flex-col items-center">
        <div className="relative mb-4">
          <Avatar className="border-border h-32 w-32 border-2 p-1">
            <AvatarImage src={customer?.avata} alt={customer?.full_name} className="rounded-full object-cover" />
            <AvatarFallback className="bg-secondary text-2xl">{customer?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-0 bottom-0 px-2 py-1">
            <Award className="mr-1 h-3 w-3" />
            {customer?.point} Point
          </Badge>
        </div>
        <h1 className="text-foreground text-3xl font-bold">{customer?.full_name}</h1>
        <p className="text-muted-foreground mt-1">Thành viên MenStuff</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-1">
          <Card className="bg-card border-border">
            <CardContent className="space-y-2 p-4">
              <button
                type="button"
                onClick={() => goTab('profile')}
                className={`relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tab === 'profile' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <User className="h-4 w-4 shrink-0" /> Hồ sơ cá nhân
              </button>
              <button
                type="button"
                onClick={() => goTab('orders')}
                className={`relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tab === 'orders' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Package className="h-4 w-4 shrink-0" /> Đơn hàng của tôi
                <ProcessingOrdersBadge />
              </button>
              <button
                type="button"
                onClick={() => goTab('history')}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tab === 'history' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Receipt className="h-4 w-4 shrink-0" /> Lịch sử mua hàng
              </button>
              <button
                type="button"
                onClick={() => goTab('settings')}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tab === 'settings' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Settings className="h-4 w-4 shrink-0" /> Cài đặt
              </button>
            </CardContent>
          </Card>

          <div className="px-2">
            <LogoutButton />
          </div>
        </div>

        <div className="space-y-6 md:col-span-2">
          {tab === 'orders' && <AccountOrdersPanel />}

          {tab === 'history' && <AccountPurchaseHistoryPanel />}

          {tab === 'profile' && (
            <Card className="bg-card border-border shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Thông tin chi tiết</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Quản lý thông tin liên lạc và định danh của bạn.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-muted text-muted-foreground rounded-full p-2">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Họ và tên</p>
                    <p className="text-foreground font-medium">{customer?.full_name || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                <div className="flex items-center gap-4">
                  <div className="bg-muted text-muted-foreground rounded-full p-2">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Số điện thoại</p>
                    <p className="text-foreground font-medium">{customer?.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                <div className="flex items-center gap-4">
                  <div className="bg-muted text-muted-foreground rounded-full p-2">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Điểm tích lũy</p>
                    <p className="text-foreground text-lg font-medium">{customer?.point?.toLocaleString()} điểm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {tab === 'settings' && (
            <Card className="bg-card border-border shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Cài đặt</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Phần này đang được hoàn thiện — đổi mật khẩu và tùy chọn bảo mật sẽ có sau.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {tab === 'profile' && (
            <div className="border-border bg-muted/30 rounded-lg border p-4">
              <p className="text-muted-foreground text-xs leading-relaxed">
                Mọi thông tin cá nhân của bạn đều được bảo mật theo chính sách quyền riêng tư của MenStuff. Bạn có thể
                thay đổi mật khẩu hoặc yêu cầu xóa dữ liệu trong mục cài đặt.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
