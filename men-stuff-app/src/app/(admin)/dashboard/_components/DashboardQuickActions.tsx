'use client'

import { useState } from 'react'
import Link from 'next/link'
import { labels } from '@/lib/labels'
import { Button } from '@/components/ui/button'
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
    <section className="rounded-xl border border-border bg-card/80 p-6 shadow-[0_0_40px_-18px_rgba(247,147,26,0.12)] backdrop-blur">
      <h2 className="mb-4 text-xl font-semibold text-foreground">{quickActionsLabel}</h2>
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild className="rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] font-semibold text-primary-foreground shadow-glow-orange">
          <Link href="/products-management/new">{createProductLabel}</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-border">
          <Link href="/products-management">{productsLabel}</Link>
        </Button>
        <Button asChild variant="secondary" className="rounded-full">
          <Link href="/order">{labels.admin.orders}</Link>
        </Button>
        <UploadButton onUploadSuccess={setImageUrl} />
        {imageUrl && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>URL:</span>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[200px] truncate text-primary hover:underline"
            >
              {imageUrl}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
