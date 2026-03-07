'use client'

import { useState, useCallback } from 'react'

const STAR_COUNT = 5

type FeedbackWidgetProps = {
  productId?: string | null
  orderId?: string | null
}

export default function FeedbackWidget({ productId, orderId }: FeedbackWidgetProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async () => {
    if (rating < 1) {
      setError('Vui lòng chọn đánh giá từ 1–5 sao.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/guest/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined,
          product_id: productId ?? undefined,
          order_id: orderId ?? undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Gửi thất bại. Vui lòng thử lại.')
        return
      }
      setSent(true)
      setComment('')
      setRating(0)
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [rating, comment, productId, orderId])

  const close = useCallback(() => {
    setOpen(false)
    setError(null)
    if (sent) {
      setSent(false)
    }
  }, [sent])

  const displayRating = hoverRating || rating

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Mở form gửi phản hồi"
      >
        <FeedbackIcon />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[99] bg-black/50"
          aria-hidden
          onClick={close}
        />
      )}

      <div
        className={`fixed bottom-0 right-0 left-0 z-[100] max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-neutral-700 bg-neutral-900 text-white shadow-2xl transition-transform duration-300 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md sm:rounded-2xl sm:border ${
          open ? 'translate-y-0' : 'translate-y-full sm:translate-y-[calc(100%+1.5rem)]'
        }`}
        role="dialog"
        aria-labelledby="feedback-title"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-700 bg-neutral-900 px-4 py-3">
          <h2 id="feedback-title" className="text-lg font-semibold">
            Gửi phản hồi
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            aria-label="Đóng"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-4">
          {sent ? (
            <div className="py-8 text-center">
              <p className="text-lg font-medium text-white">Cảm ơn bạn đã gửi phản hồi!</p>
              <p className="mt-1 text-sm text-neutral-400">
                Ý kiến của bạn giúp chúng tôi cải thiện trải nghiệm.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-4 rounded-lg border border-neutral-600 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Đóng
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="mb-2 text-sm font-medium text-neutral-300">
                  Đánh giá của bạn (1–5 sao)
                </p>
                <div
                  className="flex gap-1"
                  role="group"
                  aria-label="Chọn số sao"
                >
                  {Array.from({ length: STAR_COUNT }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl text-amber-400 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                      aria-pressed={rating === i + 1}
                      aria-label={`${i + 1} sao`}
                    >
                      {i + 1 <= displayRating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="feedback-comment" className="mb-2 block text-sm font-medium text-neutral-300">
                  Nhận xét (tùy chọn)
                </label>
                <textarea
                  id="feedback-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ thêm với chúng tôi..."
                  rows={3}
                  className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-white py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
                >
                  {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg border border-neutral-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Đóng
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function FeedbackIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}
