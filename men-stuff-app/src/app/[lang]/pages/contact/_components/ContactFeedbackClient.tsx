'use client'

import { useState } from 'react'

const STAR_COUNT = 5

export default function ContactFeedbackClient() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState<string | null>(null)

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
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
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
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
  }

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactError(null)
    setContactLoading(true)
    try {
      // Placeholder: chưa có API contact, chỉ mô phỏng
      await new Promise((r) => setTimeout(r, 600))
      setContactSent(true)
      setContactName('')
      setContactEmail('')
      setContactMessage('')
    } catch {
      setContactError('Gửi tin nhắn thất bại.')
    } finally {
      setContactLoading(false)
    }
  }

  const displayRating = hoverRating || rating

  const inputClass =
    'w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white'
  const labelClass = 'mb-2 block text-sm font-medium text-neutral-300'

  return (
    <div className="mx-auto max-w-3xl space-y-16 px-4 py-12">
      {/* Liên hệ */}
      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="text-2xl font-bold text-white">
          Liên hệ
        </h2>
        <p className="mt-2 text-neutral-400">
          Gửi câu hỏi hoặc yêu cầu hỗ trợ, chúng tôi sẽ phản hồi sớm.
        </p>
        {contactSent ? (
          <div className="mt-6 rounded-lg border border-neutral-700 bg-neutral-800/50 p-6 text-center">
            <p className="font-medium text-white">Đã gửi tin nhắn thành công.</p>
            <p className="mt-1 text-sm text-neutral-400">
              Chúng tôi sẽ liên hệ lại qua email của bạn.
            </p>
          </div>
        ) : (
          <form onSubmit={submitContact} className="mt-6 space-y-4">
            <div>
              <label htmlFor="contact-name" className={labelClass}>
                Họ tên
              </label>
              <input
                id="contact-name"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Nhập họ tên"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className={labelClass}>
                Nội dung
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Nhập nội dung"
                className={inputClass}
              />
            </div>
            {contactError && (
              <p className="text-sm text-red-400" role="alert">
                {contactError}
              </p>
            )}
            <button
              type="submit"
              disabled={contactLoading}
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {contactLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </form>
        )}
      </section>

      {/* Feedback nhanh */}
      <section aria-labelledby="feedback-heading">
        <h2 id="feedback-heading" className="text-2xl font-bold text-white">
          Gửi phản hồi
        </h2>
        <p className="mt-2 text-neutral-400">
          Đánh giá trải nghiệm của bạn giúp chúng tôi cải thiện dịch vụ.
        </p>
        {sent ? (
          <div className="mt-6 rounded-lg border border-neutral-700 bg-neutral-800/50 p-6 text-center">
            <p className="font-medium text-white">Cảm ơn bạn đã gửi phản hồi!</p>
            <p className="mt-1 text-sm text-neutral-400">
              Ý kiến của bạn rất có giá trị với chúng tôi.
            </p>
          </div>
        ) : (
          <form onSubmit={submitFeedback} className="mt-6 space-y-4">
            <div>
              <p className={labelClass}>Đánh giá (1–5 sao)</p>
              <div className="flex gap-2" role="group" aria-label="Chọn số sao">
                {Array.from({ length: STAR_COUNT }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl text-amber-400 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
                    aria-pressed={rating === i + 1}
                    aria-label={`${i + 1} sao`}
                  >
                    {i + 1 <= displayRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="feedback-comment" className={labelClass}>
                Nhận xét (tùy chọn)
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ thêm với chúng tôi..."
                rows={3}
                className={inputClass}
              />
            </div>
            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
