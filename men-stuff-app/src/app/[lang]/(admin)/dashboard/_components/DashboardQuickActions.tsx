'use client'

import { useState } from 'react'
import Link from 'next/link'
import UploadButton from './UploadButton'

type DashboardQuickActionsProps = {
  locale: string
  createProductLabel: string
  productsLabel: string
  quickActionsLabel: string
}

export default function DashboardQuickActions({
  locale,
  createProductLabel,
  productsLabel,
  quickActionsLabel,
}: DashboardQuickActionsProps) {
  const [imageUrl, setImageUrl] = useState<string>('')

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {quickActionsLabel}
      </h2>
      <div className="flex flex-wrap gap-4 items-center">
        <Link
          href={`/${locale}/products-management/new`}
          className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          {createProductLabel}
        </Link>
        <Link
          href={`/${locale}/products-management`}
          className="inline-flex items-center justify-center bg-gray-200 text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
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
              className="text-blue-600 hover:underline truncate max-w-[200px]"
            >
              {imageUrl}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
