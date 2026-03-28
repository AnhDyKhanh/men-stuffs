import Link from 'next/link'
import { User } from 'lucide-react'
import type { NavLink } from '@/constants/placeholderData'
import ProcessingOrdersBadge from './ProcessingOrdersBadge'

interface HeaderProps {
  logoLabel: string
  navLinks: NavLink[]
  accountHref: string
  accountLabel: string
  cartHref: string
  cartLabel: string
  searchLabel: string
  /** When set, shows an Admin link (e.g. for admin users) */
  adminHref?: string
}

export default function Header({
  logoLabel,
  navLinks,
  accountHref,
  accountLabel,
  cartHref,
  cartLabel,
  searchLabel,
  adminHref,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="-ml-2 rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white md:hidden"
              aria-label="Menu"
            >
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="font-mono text-xs tracking-widest text-white/70 uppercase transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold tracking-tight text-white md:text-xl"
          >
            <span className="text-gradient-gold">{logoLabel}</span>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            {adminHref && (
              <Link
                href={adminHref}
                className="hidden rounded-full border border-[#F7931A]/40 bg-[#F7931A]/10 px-3 py-1 text-xs font-medium tracking-wider text-white shadow-[0_0_18px_-10px_rgba(247,147,26,0.6)] transition hover:border-[#F7931A]/70 hover:bg-[#F7931A]/15 sm:inline"
              >
                ADMIN
              </Link>
            )}
            <Link
              href={accountHref}
              className="relative hidden items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white sm:inline-flex"
            >
              {accountLabel}
              <ProcessingOrdersBadge />
            </Link>
            <Link
              href={accountHref}
              className="relative flex rounded-lg p-2 text-white/70 transition hover:bg-white/5 hover:text-white sm:hidden"
              aria-label={accountLabel}
            >
              <User className="h-5 w-5" />
              <ProcessingOrdersBadge />
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-white/70 transition hover:bg-white/5 hover:text-white"
              aria-label={searchLabel}
            >
              <SearchIcon />
            </button>
            <Link
              href={cartHref}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/80 shadow-[0_0_20px_-14px_rgba(247,147,26,0.35)] transition hover:border-[#F7931A]/50 hover:bg-white/8 hover:text-white hover:shadow-[0_0_30px_-12px_rgba(247,147,26,0.55)]"
            >
              <CartIcon />
              <span className="hidden text-sm sm:inline">{cartLabel}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" strokeWidth={2} />
      <path strokeWidth={2} strokeLinecap="round" d="m21 21-4.35-4.35" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  )
}
