import type { Metadata } from 'next'
import './globals.css'
import { locales } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Men Stuffs - E-commerce Store',
  description: "Modern e-commerce store for men's products",
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
