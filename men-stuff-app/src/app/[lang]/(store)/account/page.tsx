'use client'

import LogoutButton from '@/app/[lang]/_components/admin/LogoutButton'
import { useGetCustomerAccountInfor } from '@/app/_hooks/getCustomerAccountInfor'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Award, Package, Phone, Settings, User } from 'lucide-react'

export default function AccountPage() {
  const { data: response, isLoading } = useGetCustomerAccountInfor()
  const customer = response?.data

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="h-32 w-32 bg-muted rounded-full mx-auto mb-8" />
        <div className="h-8 w-48 bg-muted mx-auto mb-4" />
        <div className="h-4 w-64 bg-muted mx-auto" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header Profile */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative mb-4">
          <Avatar className="h-32 w-32 border-2 border-border p-1">
            <AvatarImage src={customer?.avata} alt={customer?.full_name} className="rounded-full object-cover" />
            <AvatarFallback className="bg-secondary text-2xl">
              {customer?.full_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Badge className="absolute bottom-0 right-0 bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1">
            <Award className="w-3 h-3 mr-1" />
            {customer?.point} Point
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{customer?.full_name}</h1>
        <p className="text-muted-foreground mt-1">Thành viên MenStuff</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Menu */}
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-secondary text-foreground text-sm font-medium">
                <User className="w-4 h-4" /> Hồ sơ cá nhân
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground text-sm transition-colors">
                <Package className="w-4 h-4" /> Đơn hàng của tôi
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground text-sm transition-colors">
                <Settings className="w-4 h-4" /> Cài đặt
              </button>
            </CardContent>
          </Card>

          <div className="px-2">
            <LogoutButton lang="vi" />
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Thông tin chi tiết</CardTitle>
              <CardDescription className="text-muted-foreground">
                Quản lý thông tin liên lạc và định danh của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-full text-muted-foreground">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Họ và tên</p>
                  <p className="text-foreground font-medium">{customer?.full_name || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-full text-muted-foreground">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Số điện thoại</p>
                  <p className="text-foreground font-medium">{customer?.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-full text-muted-foreground">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Điểm tích lũy</p>
                  <p className="text-foreground font-medium text-lg">{customer?.point?.toLocaleString()} điểm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mọi thông tin cá nhân của bạn đều được bảo mật theo chính sách quyền riêng tư của MenStuff. Bạn có thể thay đổi mật khẩu hoặc yêu cầu xóa dữ liệu trong mục cài đặt.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}