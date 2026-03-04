'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
          const isAdminPath = redirectParam && /\/vi\/(admin|dashboard|products-management|categories-management)/.test(redirectParam)
          router.push(!isAdminPath && redirectParam ? redirectParam : basePath)
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
      <DialogContent className="p-0 border-none bg-transparent max-w-md shadow-none overflow-hidden" showCloseButton={false}>
        <Card className="w-full border-border bg-card shadow-2xl relative">
          <DialogHeader className="sr-only">
            <DialogTitle>Đăng nhập</DialogTitle>
          </DialogHeader>
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-secondary rounded-2xl border border-border/50">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground uppercase">
                Đăng nhập
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Email & Mật khẩu
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    required
                    className="pl-10 bg-background border-border/50 focus:border-primary/50 transition-all h-11"
                  // autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" intrinsic-label="pass" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Mật khẩu
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    className="pl-10 bg-background border-border/50 focus:border-primary/50 transition-all h-11"
                  // autoComplete="current-password"
                  />
                </div>
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-in fade-in zoom-in-95">
                  <p className="text-xs font-medium text-destructive text-center" role="alert">
                    {error}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-8 mt-10">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-all h-11 font-bold text-sm uppercase tracking-widest"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Đăng nhập'}
              </Button>

              <div className="flex flex-col items-center gap-2">
                <Link
                  href={basePath}
                  onClick={() => onOpenChange(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
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
