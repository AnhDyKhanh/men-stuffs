'use client'

import Link from 'next/link'
import { useState } from 'react'
import UploadButton from './UploadButton'

type DashboardQuickActionsProps = {
  createProductLabel: string
  productsLabel: string
  quickActionsLabel: string
}

export default function DashboardQuickActions({
  createProductLabel,
  productsLabel,
  quickActionsLabel,
}: DashboardQuickActionsProps) {
  const [imageUrl, setImageUrl] = useState<string>('')

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">{quickActionsLabel}</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/products-management/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {createProductLabel}
        </Link>
        <Link
          href="/products-management"
          className="inline-flex items-center justify-center rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300"
        >
          {productsLabel}
        </Link>
        <UploadButton onUploadSuccess={setImageUrl} />
        {imageUrl && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>URL:</span>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[200px] truncate text-blue-600 hover:underline"
            >
              {imageUrl}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
