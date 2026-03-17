import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/provider/providers'

export const metadata: Metadata = {
  title: 'Men Stuffs - Cửa hàng thời trang nam',
  description: 'Cửa hàng thời trang nam',
  icons: {
    icon: '/icon',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
