import { LoginForm } from './_components/LoginForm'
import { labels, BASE_PATH } from '@/lib/labels'

type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function LoginPage({ params }: PageProps) {
  await params
  return <LoginForm dict={labels} basePath={BASE_PATH} />
}
