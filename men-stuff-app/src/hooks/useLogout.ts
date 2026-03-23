// hook useLogout
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (!res.ok) throw new Error('Logout failed')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['@auth-me'] })
      queryClient.removeQueries({ queryKey: ['@auth-me'] })
    },
  })
}