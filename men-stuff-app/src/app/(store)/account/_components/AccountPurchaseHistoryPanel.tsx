'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES } from '@/constants/apiRouter'
import { BASE_PATH } from '@/lib/labels'
import { getOrderStatusLabel } from '@/constants/orderStatus'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Star, X, ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import type { HistoryOrder, HistoryLine } from '@/types/guestOrderHistory'

type HistoryResponse = { data?: { orders?: HistoryOrder[] } }

const REVIEWABLE = new Set(['picked_up', 'delivered'])

function formatVnd(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function ReviewDialog({
  open,
  onOpenChange,
  orderId,
  line,
  onDone,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  orderId: string
  line: HistoryLine
  onDone: () => void
}) {
  const productId = line.product_id
  const productName = line.product?.name ?? 'Sản phẩm'
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setRating(5)
      setComment('')
      setFiles((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.preview))
        return []
      })
    }
  }, [open])

  const addFiles = useCallback((list: FileList | File[]) => {
    const arr = Array.from(list).filter((f) => f.type.startsWith('image/'))
    setFiles((prev) => {
      const next = [...prev]
      for (const file of arr) {
        if (next.length >= 5) break
        if (file.size > 4 * 1024 * 1024) {
          toast.error(`${file.name}: tối đa 4MB`)
          continue
        }
        next.push({ file, preview: URL.createObjectURL(file) })
      }
      return next
    })
  }, [])

  const removeFile = (i: number) => {
    setFiles((prev) => {
      const t = [...prev]
      const [x] = t.splice(i, 1)
      if (x) URL.revokeObjectURL(x.preview)
      return t
    })
  }

  const onPaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.files
    if (items?.length) addFiles(items)
  }

  const submit = async () => {
    setSubmitting(true)
    try {
      const urls: string[] = []
      for (const { file } of files) {
        const fd = new FormData()
        fd.set('image', file)
        const up = await fetch(API_ROUTES.GUEST.REVIEW_UPLOAD, { method: 'POST', body: fd, credentials: 'include' })
        const ju = await up.json().catch(() => ({}))
        if (!up.ok) {
          throw new Error((ju as { error?: string }).error || 'Upload ảnh thất bại')
        }
        urls.push((ju as { url: string }).url)
      }

      const res = await fetch(API_ROUTES.GUEST.REVIEWS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          order_id: orderId,
          product_id: productId,
          rating,
          comment: comment.trim() || null,
          image_urls: urls,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error((j as { error?: string }).error || 'Không gửi được đánh giá')
      }
      toast.success('Cảm ơn bạn đã đánh giá')
      onOpenChange(false)
      onDone()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-border max-h-[90dvh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đánh giá: {productName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Số sao</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="rounded p-1 transition hover:opacity-90"
                  aria-label={`${s} sao`}
                >
                  <Star
                    className={`h-7 w-7 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Bình luận (có thể dán ảnh Ctrl+V vào khung)</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onPaste={onPaste}
              placeholder="Chia sẻ trải nghiệm của bạn…"
              rows={4}
              className={cn(
                'min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30',
              )}
            />
          </div>
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => inputRef.current?.click()}>
              <ImagePlus className="h-4 w-4" />
              Chọn ảnh (tối đa 5)
            </Button>
            <div className="mt-3 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <div key={f.preview} className="relative h-16 w-16 overflow-hidden rounded-md border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.preview} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    className="bg-background/90 absolute right-0 top-0 rounded-bl p-0.5"
                    onClick={() => removeFile(i)}
                    aria-label="Xóa ảnh"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="button" disabled={submitting} onClick={() => void submit()}>
            {submitting ? 'Đang gửi…' : 'Gửi đánh giá'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AccountPurchaseHistoryPanel() {
  const queryClient = useQueryClient()
  const [reviewTarget, setReviewTarget] = useState<{ orderId: string; line: HistoryLine } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['guest-orders-history'],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.GUEST.ORDERS_HISTORY, { cache: 'no-store', credentials: 'include' })
      if (!res.ok) throw new Error('Không tải được lịch sử')
      const json = (await res.json()) as HistoryResponse
      return json?.data?.orders ?? []
    },
    staleTime: 30_000,
  })

  const orders = useMemo(() => data ?? [], [data])

  const onReviewDone = () => {
    void queryClient.invalidateQueries({ queryKey: ['guest-orders-history'] })
    void queryClient.invalidateQueries({ queryKey: ['guest-orders-progress'] })
  }

  if (isLoading) {
    return (
      <div className="border-border bg-card animate-pulse rounded-2xl border p-8">
        <div className="bg-muted mb-4 h-6 w-48 rounded" />
        <div className="bg-muted h-24 rounded" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <section className="border-border bg-card rounded-2xl border p-8 shadow-md">
        <h2 className="text-foreground text-lg font-semibold">Lịch sử mua hàng</h2>
        <p className="text-muted-foreground mt-2 text-sm">Bạn chưa có đơn hoàn tất nào trong lịch sử.</p>
      </section>
    )
  }

  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-md">
      <h2 className="text-foreground mb-4 text-lg font-semibold">Lịch sử mua hàng</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border-border bg-muted/15 rounded-xl border p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-muted-foreground font-mono text-xs">
                  {order.order_code ?? `Đơn #${order.id.slice(0, 8)}`}
                </p>
                <p className="text-muted-foreground text-xs">
                  {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-primary text-sm font-medium">{getOrderStatusLabel(order.status)}</p>
                <p className="text-foreground text-sm font-semibold">
                  {formatVnd(Number(order.total_amount ?? 0))}
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {order.items.map((line) => {
                const href = `${BASE_PATH}/product/${line.product_id}`
                const canReview = order.status != null && REVIEWABLE.has(order.status) && !line.review
                return (
                  <li
                    key={line.id}
                    className="border-border flex flex-col gap-3 rounded-lg border bg-background/50 p-3 sm:flex-row sm:items-center"
                  >
                    <Link href={href} className="flex flex-1 gap-3 transition opacity-90 hover:opacity-100">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                        {line.product?.origin_image ? (
                          <Image src={line.product.origin_image} alt="" fill className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground line-clamp-2 text-sm font-medium">
                          {line.product?.name ?? 'Sản phẩm'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          SL: {line.quantity} × {formatVnd(line.price)}
                        </p>
                      </div>
                    </Link>
                    <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                      {line.review ? (
                        <div className="text-muted-foreground max-w-[240px] text-xs">
                          <div className="flex gap-0.5 text-amber-400">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < (line.review?.rating ?? 0) ? 'fill-amber-400' : 'text-muted-foreground'}`}
                              />
                            ))}
                          </div>
                          {line.review.comment ? <p className="mt-1">{line.review.comment}</p> : null}
                          {line.review.image_urls?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {line.review.image_urls.map((u) => (
                                <a
                                  key={u}
                                  href={u}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="relative block h-12 w-12 overflow-hidden rounded border"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={u} alt="" className="h-full w-full object-cover" />
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : canReview ? (
                        <Button type="button" size="sm" variant="secondary" onClick={() => setReviewTarget({ orderId: order.id, line })}>
                          Đánh giá sản phẩm
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">Chưa thể đánh giá</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {reviewTarget ? (
        <ReviewDialog
          open
          onOpenChange={(v) => !v && setReviewTarget(null)}
          orderId={reviewTarget.orderId}
          line={reviewTarget.line}
          onDone={onReviewDone}
        />
      ) : null}
    </section>
  )
}
