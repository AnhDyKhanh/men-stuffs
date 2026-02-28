import { getDictionary, isValidLocale } from '@/lib/i18n'
import { LoginForm } from './_components/LoginForm'

type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function LoginPage({ params }: PageProps) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)
  console.log('admin@menstuff.local')
  console.log('admin123')
  return <LoginForm dict={dict} locale={locale} />
}
