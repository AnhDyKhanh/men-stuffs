'use client'

import { useRegister } from '@/hooks/useRegister'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
  })
  const [errorMessage, setErrorMessage] = useState('')

  const registerMutation = useRegister()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Validate mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp')
      return
    }

    const { confirmPassword, ...registerData } = formData

    registerMutation.mutate(registerData, {
      onSuccess: (data) => {
        if (data.error) {
          setErrorMessage(data.error)
          return
        }
        toast.success("Đăng ký thành công!", {
          description: "Vui lòng đăng nhập để tiếp tục",
        })
        router.push('/login')
      },
      onError: () => {
        setErrorMessage('Đã xảy ra lỗi khi đăng ký, vui lòng thử lại')
      },
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  return (
    <Dialog open={true}>
      <DialogContent
        className="max-w-md overflow-hidden border-none bg-transparent p-0 shadow-none"
        showCloseButton={false}
      >
        <Card className="border-border bg-card relative w-full shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Đăng ký</DialogTitle>
          </DialogHeader>

          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="bg-secondary border-border/50 rounded-2xl border p-3">
                <ShieldCheck className="text-primary h-8 w-8" />
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-foreground text-2xl font-bold tracking-tight uppercase">Đăng ký</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">Tham gia cùng Helios Global</CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Họ và tên */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">Họ và tên</Label>
                <div className="group relative">
                  <User className="text-muted-foreground group-focus-within:text-primary absolute top-3 left-3 h-4 w-4 transition-colors" />
                  <Input id="full_name" value={formData.full_name} onChange={handleChange} placeholder="Nguyễn Văn A" required className="bg-background h-11 pl-10" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">Email</Label>
                <div className="group relative">
                  <Mail className="text-muted-foreground group-focus-within:text-primary absolute top-3 left-3 h-4 w-4 transition-colors" />
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required className="bg-background h-11 pl-10" />
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">Số điện thoại</Label>
                <div className="group relative">
                  <Phone className="text-muted-foreground group-focus-within:text-primary absolute top-3 left-3 h-4 w-4 transition-colors" />
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="090xxxxxxx" required className="bg-background h-11 pl-10" />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">Mật khẩu</Label>
                  <div className="group relative">
                    <Lock className="text-muted-foreground group-focus-within:text-primary absolute top-3 left-3 h-4 w-4 transition-colors" />
                    <Input id="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="bg-background h-11 pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">Xác nhận</Label>
                  <div className="group relative">
                    <Lock className="text-muted-foreground group-focus-within:text-primary absolute top-3 left-3 h-4 w-4 transition-colors" />
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required className="bg-background h-11 pl-10" />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
                  <p className="text-destructive text-center text-xs font-medium">{errorMessage}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="mt-6 flex flex-col gap-3 pb-8">
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="bg-primary text-primary-foreground h-11 w-full text-sm font-bold tracking-widest uppercase transition-all hover:opacity-90"
              >
                {registerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tạo tài khoản'}
              </Button>
              <p className="text-muted-foreground text-center text-xs">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-primary hover:underline font-medium"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  )
}