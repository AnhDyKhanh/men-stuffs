'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 phút mới fetch lại một lần
        refetchOnWindowFocus: false, // Tắt việc tự fetch khi chuyển Tab trình duyệt
        retry: 1, // Chỉ thử lại 1 lần nếu lỗi để tránh nghẽn mạng
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}