'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  buildBotReply,
  getSuggestionChips,
  loadHabits,
  recordChipClick,
  recordPathVisit,
  type SuggestionChip,
} from '@/lib/chatbot-habits'

type Message = {
  id: string
  role: 'user' | 'bot'
  text: string
  chips?: SuggestionChip[]
}

export default function ChatbotWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [habits, setHabits] = useState(() => loadHabits())
  const listRef = useRef<HTMLDivElement>(null)

  const starterChips = useMemo(() => getSuggestionChips(pathname ?? '/', habits), [pathname, habits])

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  useEffect(() => {
    if (!pathname) return
    recordPathVisit(pathname)
    setHabits(loadHabits())
  }, [pathname])

  const pushBot = (text: string, chips?: SuggestionChip[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        role: 'bot',
        text,
        chips,
      },
    ])
  }

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

    const reply = buildBotReply(text, pathname ?? '/')
    const chips =
      reply.followUp && reply.followUp.length > 0 ? reply.followUp.slice(0, 4) : starterChips.slice(0, 4)
    pushBot(reply.text, chips)
  }

  const onChip = (chip: SuggestionChip) => {
    recordChipClick(chip.id)
    setHabits(loadHabits())
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-glow-orange transition hover:border-primary/50 hover:shadow-glow-gold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={isOpen ? 'Đóng chatbot' : 'Mở chatbot'}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed right-6 bottom-24 z-50 flex w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_0_50px_-14px_rgba(247,147,26,0.25)]"
          role="dialog"
          aria-label="Trợ lý Men Stuffs"
        >
          <div className="flex items-center justify-between border-b border-border bg-background/60 px-4 py-3 backdrop-blur">
            <div>
              <div className="text-sm font-semibold">
                <span className="text-gradient-gold">Men Stuffs</span> Assistant
              </div>
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Gợi ý theo thói quen</p>
            </div>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">Beta</span>
          </div>

          <div ref={listRef} className="flex max-h-[340px] min-h-[220px] flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Chào bạn! Mình gợi ý nhanh dựa trên trang bạn đang xem và vài lần tương tác trước (lưu trên máy bạn).
                </p>
                <div className="flex flex-wrap gap-2">
                  {starterChips.map((chip) => (
                    <Button key={chip.id} asChild size="sm" variant="secondary" className="h-8 rounded-full border border-border bg-card/80 text-xs">
                      <Link href={chip.href} onClick={() => onChip(chip)}>
                        {chip.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span
                  className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-background/80 text-foreground'
                  }`}
                >
                  {m.text}
                </span>
                {m.role === 'bot' && m.chips && m.chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.chips.map((chip) => (
                      <Button
                        key={`${m.id}-${chip.id}`}
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full border-border text-xs"
                      >
                        <Link href={chip.href} onClick={() => onChip(chip)}>
                          {chip.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-background/60 p-3 backdrop-blur">
            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi về New In, giá, giỏ hàng..."
                className="min-h-10 border-border bg-card/80"
              />
              <Button type="button" onClick={handleSend} className="shrink-0 rounded-full bg-linear-to-r from-[#EA580C] to-[#F7931A] font-semibold text-primary-foreground shadow-glow-orange">
                Gửi
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
