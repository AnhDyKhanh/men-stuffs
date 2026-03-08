import Link from 'next/link'
import { BASE_PATH } from '@/lib/labels'
import ContactFeedbackClient from './_components/ContactFeedbackClient'

type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function ContactPage({ params }: PageProps) {
  await params

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-16">
        <Link
          href={BASE_PATH}
          className="mb-10 inline-block text-sm text-neutral-400 hover:text-white"
        >
          ← Về trang chủ
        </Link>
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Liên hệ & Phản hồi
          </h1>
          <p className="mt-2 text-neutral-400">
            Gửi tin nhắn hoặc đánh giá trải nghiệm của bạn.
          </p>
        </header>
        <ContactFeedbackClient />
      </div>
    </div>
  )
}
