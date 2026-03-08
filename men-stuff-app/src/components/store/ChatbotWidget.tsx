'use client'

import { useState, useRef, useEffect } from 'react'

const PLACEHOLDER_REPLY =
  'Tính năng chatbot đang được phát triển. Bạn vui lòng quay lại sau hoặc liên hệ qua trang Liên hệ. Cảm ơn bạn!'

type Message = {
  id: string
  role: 'user' | 'bot'
  text: string
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: 'bot',
      text: PLACEHOLDER_REPLY,
    }
    setMessages((prev) => [...prev, botMsg])
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 border border-neutral-600 text-white shadow-lg hover:bg-neutral-700 transition focus:outline-none focus:ring-2 focus:ring-neutral-500"
        aria-label={isOpen ? 'Đóng chatbot' : 'Mở chatbot'}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-3rem)] flex-col rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl"
          role="dialog"
          aria-label="Chatbot (đang phát triển)"
        >
          <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
            <span className="font-semibold text-white">Chatbot</span>
            <span className="text-xs text-neutral-500">Upcoming</span>
          </div>

          <div
            ref={listRef}
            className="flex min-h-[240px] max-h-[320px] flex-1 flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.length === 0 && (
              <p className="text-center text-sm text-neutral-500 py-4">
                Chào bạn! Tính năng đang được phát triển. Thử gửi tin nhắn để xem phản hồi mẫu.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-neutral-700 text-white'
                      : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-700 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                className="rounded-lg bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-600 transition"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
