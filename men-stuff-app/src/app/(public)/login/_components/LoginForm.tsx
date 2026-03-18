'use client'

import { useLogin } from '@/app/_hooks/useLogin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loginMutation = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.error) {
            setErrorMessage(data.error)
            return
          }

          const role = data.role as 'admin' | 'user' | undefined
          const searchParams = new URLSearchParams(window.location.search)
          const redirectParam = searchParams.get('redirect')

          if (role === 'admin') {
            router.push(redirectParam || `/dashboard`)
          } else {
            const isAdminPath =
              redirectParam && /^\/(admin|dashboard|products-management|categories-management)/.test(redirectParam)
            router.push(!isAdminPath && redirectParam ? redirectParam : '/')
          }
          toast.success("Đăng nhập thành công!", {
            description: "Chào mừng bạn trở lại Men Stuffs",
          })
          router.refresh()
        },
        onError: () => {
          setErrorMessage('Invalid credentials')
        },
      }
    )
  }

  return (
    <Dialog open={true}>
      <DialogContent
        className="max-w-md overflow-hidden border-none bg-transparent p-0 shadow-none"
        showCloseButton={false}
      >
        <Card className="border-border bg-card relative w-full shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Đăng nhập</DialogTitle>
          </DialogHeader>
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="bg-secondary border-border/50 rounded-2xl border p-3">
                <ShieldCheck className="text-primary h-8 w-8" />
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-foreground text-2xl font-bold tracking-tight uppercase">Đăng nhập</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">Email & Mật khẩu</CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
                >
                  Email
                </Label>
                <div className="group relative">
                  <Mail className="text-muted-foreground group-focus-within:text-primary absolute top-3 left-3 h-4 w-4 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    required
                    className="bg-background border-border/50 focus:border-primary/50 h-11 pl-10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
                >
                  Mật khẩu
                </Label>
                <div className="group relative">
                  <Lock className="text-muted-foreground group-focus-within:text-primary absolute top-3 left-3 h-4 w-4 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    className="bg-background border-border/50 focus:border-primary/50 h-11 pl-10 transition-all"
                  />
                </div>
              </div>
              {(errorMessage || loginMutation.isError) && (
                <div className="bg-destructive/10 border-destructive/20 animate-in fade-in zoom-in-95 rounded-lg border p-3">
                  <p className="text-destructive text-center text-xs font-medium" role="alert">
                    {errorMessage || 'Đã xảy ra lỗi vui lòng thử lại'}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="mt-10 flex flex-col gap-4 pb-8">
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="bg-primary text-primary-foreground h-11 w-full text-sm font-bold tracking-widest uppercase transition-all hover:opacity-90"
              >
                {loginMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Đăng nhập'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/register')}
                disabled={loginMutation.isPending}
                className="bg-primary text-primary-foreground h-11 w-full text-sm font-bold tracking-widest uppercase transition-all hover:opacity-90"
              >
                Đăng ký
              </Button>

              <div className="flex flex-col items-center gap-2">
                <Link
                  href={'/'}
                  className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 transition-colors hover:underline"
                >
                  Tiếp tục với tư cách khách
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  )
}