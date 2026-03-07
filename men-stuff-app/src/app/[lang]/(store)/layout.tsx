import { cookies } from 'next/headers'
import { labels, BASE_PATH } from '@/lib/labels'
import { getUserRole } from '@/lib/auth'
import {
  getMainNavLinks,
  getFooterColumns,
} from '@/app/_constants/placeholderData'
import AnnouncementBar from '@/components/store/AnnouncementBar'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import ChatbotWidget from '@/components/store/ChatbotWidget'

const SITE_NAME = 'Men Stuffs'
const COPYRIGHT_TEXT = '© 2024 Men Stuffs. All rights reserved.'

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  await params
  const cookieStore = await cookies()
  const userRole = getUserRole(cookieStore)

  const navLinks = getMainNavLinks(BASE_PATH)
  const footerColumns = getFooterColumns(BASE_PATH)

  const accountHref =
    userRole === 'guest' ? `${BASE_PATH}/login` : `${BASE_PATH}/account`
  const accountLabel =
    userRole === 'guest' ? labels.common.login : labels.common.account

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar
        storeLink={`${BASE_PATH}/pages/contact`}
        storeLabel="Hệ thống cửa hàng"
      />
      <Header
        lang="vi"
        logoLabel={SITE_NAME}
        navLinks={navLinks}
        accountHref={accountHref}
        accountLabel={accountLabel}
        cartHref={`${BASE_PATH}/cart`}
        cartLabel={labels.common.cart}
        searchLabel={labels.common.search}
        adminHref={userRole === 'admin' ? `${BASE_PATH}/dashboard` : undefined}
      />

      <main id="page-content" className="flex-1">
        {children}
      </main>

      <Footer
        columns={footerColumns}
        copyrightText={COPYRIGHT_TEXT}
        bottomLinks={[
          { key: 'footer-bottom-about-us', label: 'Về chúng tôi', href: `${BASE_PATH}/pages/about` },
          { key: 'footer-bottom-contact', label: 'Liên hệ', href: `${BASE_PATH}/pages/contact` },
        ]}
      />

      <ChatbotWidget />
    </div>
  )
}
