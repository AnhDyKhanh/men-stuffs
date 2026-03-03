import { labels, BASE_PATH } from '@/lib/labels'

type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function CheckoutPage({ params }: PageProps) {
  await params

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{labels.common.checkout}</h1>
      <p className="text-gray-600">Trang thanh toán (nội dung tùy chỉnh).</p>
    </div>
  )
}
