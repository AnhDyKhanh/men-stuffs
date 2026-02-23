'use client'

import Link from 'next/link'

const ANNOUNCEMENT_MESSAGES = [
  'Free shipping nationwide',
  '1-for-1 exchange within 3 days',
  'Lifetime warranty on selected items',
]

interface AnnouncementBarProps {
  hotline?: string
  email?: string
  storeLink: string
  storeLabel: string
}

export default function AnnouncementBar({
  hotline = '0981.956.116',
  email = 'support@example.com',
  storeLink,
  storeLabel,
}: AnnouncementBarProps) {
  return (
    <div className="bg-neutral-100 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex flex-wrap items-center gap-6">
          <a
            href={`tel:${hotline.replace(/\D/g, '')}`}
            className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
          >
            <PhoneIcon />
            <span>Hotline: {hotline}</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
          >
            <EmailIcon />
            <span>Email: {email}</span>
          </a>
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <div className="overflow-hidden text-center">
            <p className="text-neutral-700 truncate">
              {ANNOUNCEMENT_MESSAGES[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={storeLink}
            className="text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
          >
            {storeLabel}
            <LocationIcon />
          </Link>
        </div>
      </div>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m3.51 2 3.64.132A1.961 1.961 0 0 1 8.89 3.37l1.077 2.662c.25.62.183 1.326-.18 1.884l-1.379 2.121c.817 1.173 3.037 3.919 5.388 5.526l1.752-1.079a1.917 1.917 0 0 1 1.483-.226l3.485.894c.927.237 1.551 1.126 1.478 2.103l-.224 2.983c-.078 1.047-.935 1.869-1.952 1.75C6.392 20.429-1.481 2 3.511 2Z"
      />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <rect width="18" height="14" x="3" y="5" rx="1" strokeWidth={1.5} />
      <path strokeWidth={1.5} strokeLinecap="round" d="M20 5.5 12 13 4 5.5" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.032 15.287 12 22l5.968-6.713C22.545 10.14 18.889 2 12 2 5.11 2 1.455 10.139 6.032 15.287Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6z"
      />
    </svg>
  )
}
