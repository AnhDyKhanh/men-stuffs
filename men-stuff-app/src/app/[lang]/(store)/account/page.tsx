import { labels } from '@/lib/labels'

type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function AccountPage({ params }: PageProps) {
  await params

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{labels.common.account}</h1>
      <p className="text-gray-600">Trang tài khoản cá nhân.</p>
    </div>
  )
}
