// app/_hooks/useAuth.ts
'use client'
import { useQuery } from '@tanstack/react-query'

async function fetchMe() {
  const res = await fetch('/api/auth/me')
  if (!res.ok) return null
  return res.json()
}

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ['@auth-me'],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5, // cache 5 phút, không gọi lại liên tục
    retry: false,
  })

  return {
    isLoading,
    isAuthenticated: !!data?.authenticated,
    role: data?.role as 'user' | 'admin' | undefined,
    accountId: data?.accountId as string | undefined,
  }
}