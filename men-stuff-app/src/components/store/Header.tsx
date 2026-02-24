import Link from 'next/link'
import type { NavLink } from '@/app/_constants/placeholderData'

interface HeaderProps {
  lang: string
  logoLabel: string
  navLinks: NavLink[]
  accountHref: string
  accountLabel: string
  cartHref: string
  cartLabel: string
  searchLabel: string
  languageSwitcher: React.ReactNode
  /** When set, shows an Admin link (e.g. for admin users) */
  adminHref?: string
}

export default function Header({
  lang,
  logoLabel,
  navLinks,
  accountHref,
  accountLabel,
  cartHref,
  cartLabel,
  searchLabel,
  languageSwitcher,
  adminHref,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="md:hidden p-2 -ml-2 text-neutral-700 hover:text-neutral-900"
              aria-label="Menu"
            >
              <MenuIcon />
            </button>
            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Primary"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href={`/${lang}`}
            className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-neutral-900"
          >
            {logoLabel}
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            {languageSwitcher}
            {adminHref && (
              <Link
                href={adminHref}
                className="text-sm text-blue-600 hover:text-blue-700 hidden sm:inline"
              >
                Admin
              </Link>
            )}
            <Link
              href={accountHref}
              className="text-sm text-neutral-700 hover:text-neutral-900 hidden sm:inline"
            >
              {accountLabel}
            </Link>
            <button
              type="button"
              className="p-2 text-neutral-700 hover:text-neutral-900"
              aria-label={searchLabel}
            >
              <SearchIcon />
            </button>
            <Link
              href={cartHref}
              className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
            >
              <CartIcon />
              <span className="text-sm hidden sm:inline">{cartLabel}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" strokeWidth={2} />
      <path strokeWidth={2} strokeLinecap="round" d="m21 21-4.35-4.35" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  )
}
