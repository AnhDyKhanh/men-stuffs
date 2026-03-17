'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type LoginFormProps = {
  basePath: string
  open: boolean // Bắt buộc truyền từ cha để quản lý popup
  onOpenChange: (open: boolean) => void // Bắt buộc truyền để đóng popup
}

export function LoginForm({ basePath, open, onOpenChange }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        const role = data.role as 'admin' | 'user' | undefined
        const redirectParam = new URLSearchParams(window.location.search).get('redirect')

        if (role === 'admin') {
          router.push(redirectParam || `${basePath}/dashboard`)
        } else {
          const isAdminPath =
            redirectParam && /^\/(admin|dashboard|products-management|categories-management)/.test(redirectParam)
          router.push(!isAdminPath && redirectParam ? redirectParam : (basePath || '/'))
        }
        router.refresh()
        onOpenChange(false) // Đăng nhập xong thì đóng luôn modal
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                    // autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  intrinsic-label="pass"
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
                    // autoComplete="current-password"
                  />
                </div>
              </div>
              {error && (
                <div className="bg-destructive/10 border-destructive/20 animate-in fade-in zoom-in-95 rounded-lg border p-3">
                  <p className="text-destructive text-center text-xs font-medium" role="alert">
                    {error}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="mt-10 flex flex-col gap-4 pb-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground h-11 w-full text-sm font-bold tracking-widest uppercase transition-all hover:opacity-90"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Đăng nhập'}
              </Button>

              <div className="flex flex-col items-center gap-2">
                <Link
                  href={basePath}
                  onClick={() => onOpenChange(false)}
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
