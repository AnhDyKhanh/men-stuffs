import Link from 'next/link'
import type { FooterColumn, FooterLink } from '@/app/_constants/placeholderData'

interface FooterProps {
  columns: FooterColumn[]
  copyrightText: string
  bottomLinks?: FooterLink[]
}

export default function Footer({ columns, copyrightText, bottomLinks = [] }: FooterProps) {
  return (
    <footer className="mt-auto bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className="text-sm transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-700 pt-8 sm:flex-row">
          <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer">
            {bottomLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm tracking-wide uppercase transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-neutral-500">{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
