import Providers from '@/components/provider/providers'
import { defaultLocale } from '@/lib/i18n'

export function generateStaticParams() {
  return [{ lang: defaultLocale }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  await params

  return (
    <Providers>
      {children}
    </Providers>
  )
}