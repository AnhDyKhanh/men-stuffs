import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/provider/providers'
import { Toaster } from 'sonner'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'

const fontHeading = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const fontBody = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const fontMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
})

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
      <body className={`${fontHeading.variable} ${fontBody.variable} ${fontMono.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" closeButton duration={2000} />
        </Providers>
      </body>
    </html>
  )
}
