import { Suspense } from 'react'
import AccountPageClient from '@/app/(store)/account/AccountPageClient'

function AccountLoading() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-12">
      <div className="bg-muted mx-auto mb-8 h-32 w-32 rounded-full" />
      <div className="bg-muted mx-auto mb-4 h-8 w-48" />
      <div className="bg-muted mx-auto h-4 w-64" />
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoading />}>
      <AccountPageClient />
    </Suspense>
  )
}
