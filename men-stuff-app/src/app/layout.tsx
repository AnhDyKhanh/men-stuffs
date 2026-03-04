import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider'

export const metadata: Metadata = {
  title: 'Men Stuffs - Cửa hàng thời trang nam',
  description: 'Cửa hàng thời trang nam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
