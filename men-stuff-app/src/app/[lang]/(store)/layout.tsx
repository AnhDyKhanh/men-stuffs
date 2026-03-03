import { cookies } from 'next/headers'
import { getDictionary, isValidLocale } from '@/lib/i18n'
import { getUserRole } from '@/lib/auth'
import LanguageSwitcher from '@/app/[lang]/_components/LanguageSwitcher'
import {
  getMainNavLinks,
  getFooterColumns,
} from '@/app/_constants/placeholderData'
import AnnouncementBar from '@/components/store/AnnouncementBar'
import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'

const SITE_NAME = 'Men Stuffs'
const COPYRIGHT_TEXT = '© 2024 Men Stuffs. All rights reserved.'

/**
 * Store layout - customer-facing UI
 * Uses reusable Header, AnnouncementBar, Footer (inspired by reference)
 */
export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : 'vi'
  const dict = await getDictionary(locale)
  const cookieStore = await cookies()
  const userRole = getUserRole(cookieStore)

  const basePath = `/${locale}`
  const navLinks = getMainNavLinks(basePath)
  const footerColumns = getFooterColumns(basePath)

  const accountHref =
    userRole === 'guest' ? `${basePath}/login` : `${basePath}/account`
  const accountLabel =
    userRole === 'guest' ? dict.common.login : dict.common.account

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar
        storeLink={`${basePath}/pages/contact`}
        storeLabel="Store system"
      />
      <Header
        lang={locale}
        logoLabel={SITE_NAME}
        navLinks={navLinks}
        accountHref={accountHref}
        accountLabel={accountLabel}
        cartHref={`${basePath}/cart`}
        cartLabel={dict.common.cart}
        searchLabel={dict.common.search ?? 'Search'}
        languageSwitcher={<LanguageSwitcher lang={locale} />}
        adminHref={userRole === 'admin' ? `${basePath}/dashboard` : undefined}
      />

      <main id="page-content" className="flex-1">
        {children}
      </main>

      <Footer
        columns={footerColumns}
        copyrightText={COPYRIGHT_TEXT}
        bottomLinks={[
          { key: 'footer-bottom-about-us', label: 'About us', href: `${basePath}/pages/about` },
          { key: 'footer-bottom-contact', label: 'Contact', href: `${basePath}/pages/contact` },
        ]}
      />
    </div>
  )
}
