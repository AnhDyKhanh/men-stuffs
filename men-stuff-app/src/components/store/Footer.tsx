import Link from 'next/link'
import type { FooterColumn, FooterLink } from '@/app/_constants/placeholderData'

interface FooterProps {
  columns: FooterColumn[]
  copyrightText: string
  bottomLinks?: FooterLink[]
}

export default function Footer({
  columns,
  copyrightText,
  bottomLinks = [],
}: FooterProps) {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <nav
            className="flex flex-wrap items-center justify-center gap-6"
            aria-label="Footer"
          >
            {bottomLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm uppercase tracking-wide hover:text-white transition"
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
