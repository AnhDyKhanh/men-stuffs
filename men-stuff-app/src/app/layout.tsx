import type { Metadata } from 'next'
import './globals.css'

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
        {children}
      </body>
    </html>
  )
}
