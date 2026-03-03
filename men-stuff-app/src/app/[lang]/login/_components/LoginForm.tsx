'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { labels } from '@/lib/labels'

type LoginFormProps = {
  dict: typeof labels
  basePath: string
}

export function LoginForm({ dict, basePath }: LoginFormProps) {
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
      } else {
        setError(data.error || dict.login.invalidCredentials)
      }
    } catch {
      setError(dict.login.invalidCredentials)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-card-foreground">
            {dict.common.login}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {dict.login.email} & {dict.login.password}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{dict.login.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@menstuff.local"
                required
                className="bg-background border-input"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{dict.login.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background border-input"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive text-center" role="alert">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? '...' : dict.common.login}
            </Button>
            <div className="flex items-center justify-center w-full">
              <Link
                href={basePath}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                {dict.login.continueAsGuest}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
