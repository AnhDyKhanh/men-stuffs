'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BASE_PATH } from '@/lib/labels'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import { getHotProductIdsToday, trackProductClick } from '@/lib/productHot'
import { Sparkles, Send, X } from 'lucide-react'

const STORAGE_PREFS = 'men_stuffs_chatbot_prefs_v1'
const STORAGE_HISTORY = 'men_stuffs_chatbot_history_v1'

type Prefs = {
  topics: Record<string, number>
  lastSuggestions: string[]
}

type Message = {
  id: string
  role: 'user' | 'bot'
  text: string
  products?: ChatProduct[]
}

type ChatProduct = {
  id: string
  name: string
  priceFormatted: string
  href: string
  imageUrl: string
  badge?: 'HOT' | 'NEW'
}

const QUICK_LINKS: { label: string; href: string; topic: string }[] = [
  { label: 'New In', href: `${BASE_PATH}/new-in`, topic: 'new_in' },
  { label: 'Tất cả SP', href: `${BASE_PATH}/products`, topic: 'products' },
  { label: 'Giỏ hàng', href: `${BASE_PATH}/cart`, topic: 'cart' },
  { label: 'Liên hệ', href: `${BASE_PATH}/pages/contact`, topic: 'contact' },
]

function loadPrefs(): Prefs {
  if (typeof window === 'undefined') return { topics: {}, lastSuggestions: [] }
  try {
    const raw = localStorage.getItem(STORAGE_PREFS)
    if (!raw) return { topics: {}, lastSuggestions: [] }
    return JSON.parse(raw) as Prefs
  } catch {
    return { topics: {}, lastSuggestions: [] }
  }
}

function savePrefs(p: Prefs) {
  try {
    localStorage.setItem(STORAGE_PREFS, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

function bumpTopic(topic: string) {
  const p = loadPrefs()
  p.topics[topic] = (p.topics[topic] ?? 0) + 1
  savePrefs(p)
}

function rankedSuggestions(prefs: Prefs): typeof QUICK_LINKS {
  const sorted = [...QUICK_LINKS].sort(
    (a, b) => (prefs.topics[b.topic] ?? 0) - (prefs.topics[a.topic] ?? 0),
  )
  return sorted
}

function botReply(userText: string): string {
  const t = userText.toLowerCase()

  if (/new\s*in|mới|hàng mới|arrival/i.test(t)) {
    bumpTopic('new_in')
    return `Bạn có thể xem hàng mới tại trang New In — mình ưu tiên gợi ý này khi bạn hỏi về sản phẩm mới. Mở: ${BASE_PATH}/new-in`
  }
  if (/giỏ|cart|thanh toán|checkout/i.test(t)) {
    bumpTopic('cart')
    return `Giỏ hàng & thanh toán: xem giỏ tại ${BASE_PATH}/cart và thanh toán tại ${BASE_PATH}/checkout khi bạn đã đăng nhập.`
  }
  if (/đơn|order|ship|giao hàng|vận chuyển/i.test(t)) {
    return `Đơn hàng sau khi đặt sẽ được xử lý theo trạng thái (chờ xác nhận → giao hàng). Bạn có thể xem lại thông tin nhận hàng trong email/xác nhận đơn (nếu team đã bật).`
  }
  if (/giá|sale|giảm/i.test(t)) {
    bumpTopic('products')
    return `Giá hiển thị theo từng sản phẩm — vào Tất cả sản phẩm để lọc và so sánh: ${BASE_PATH}/products`
  }
  if (/chào|hello|hi\b/i.test(t)) {
    return `Chào bạn! Mình là trợ lý Men Stuffs — hỏi về **New In**, **sản phẩm**, **giỏ hàng** hoặc chọn gợi ý nhanh bên dưới nhé.`
  }

  return `Mình chưa hiểu hết ý bạn. Thử hỏi: "New In có gì mới?", "xem giỏ hàng", hoặc bấm một gợi ý nhanh — mình sẽ học thói quen (trên máy bạn) để ưu tiên gợi ý phù hợp hơn sau này.`
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isDropActive, setIsDropActive] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const { data: productsResponse } = useGetAllProducts({
    page: 1,
    size: 40,
    orderBy: 'created_at',
    ascending: false,
  })

  const prefs = useMemo(() => loadPrefs(), [messages, isOpen])

  const suggestions = useMemo(() => rankedSuggestions(prefs).slice(0, 4), [prefs])
  const allProducts = useMemo((): ChatProduct[] => {
    const products = ((productsResponse as { data?: Array<{
      id: string
      name?: string | null
      price?: number | null
      origin_image?: string | null
      slug?: string | null
    }> })?.data ?? [])
    return products.map((p) => ({
      id: p.id,
      name: p.name ?? 'Sản phẩm',
      priceFormatted: formatPrice(p.price ?? 0),
      imageUrl: p.origin_image || 'https://placehold.co/400x400/f5f5f5/999?text=Product',
      href: `${BASE_PATH}/product/${p.slug || p.id}`,
    }))
  }, [productsResponse])

  const hotProducts = useMemo(() => {
    const hotIds = new Set(getHotProductIdsToday(6))
    const hot = allProducts.filter((p) => hotIds.has(p.id)).map((p) => ({ ...p, badge: 'HOT' as const }))
    return hot.slice(0, 4)
  }, [allProducts])

  const newProducts = useMemo(() => {
    return allProducts.slice(0, 4).map((p) => ({ ...p, badge: 'NEW' as const }))
  }, [allProducts])

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY)
      if (raw) {
        const parsed = JSON.parse(raw) as Message[]
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed.slice(-40))
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || messages.length === 0) return
    try {
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(messages.slice(-40)))
    } catch {
      /* ignore */
    }
  }, [messages])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text) return

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    const lower = text.toLowerCase()
    const asksConsulting =
      /tư vấn|tu van|goi y|gợi ý|nên mua|mua gì|phối|mix|match|hot|best/.test(lower)

    const reply = botReply(text)
    const botMsg: Message = asksConsulting
      ? {
          id: `b-${Date.now()}`,
          role: 'bot',
          text:
            hotProducts.length > 0
              ? 'Mình gợi ý vài sản phẩm đang HOT hôm nay cho bạn. Kéo một card bất kỳ vào chat để mình phân tích chi tiết + gợi ý đồ đi kèm.'
              : 'Mình gợi ý vài sản phẩm NEW phù hợp để bạn tham khảo trước. Bạn có thể kéo card vào chat để mình tư vấn sâu hơn.',
          products: hotProducts.length > 0 ? hotProducts : newProducts,
        }
      : { id: `b-${Date.now()}`, role: 'bot', text: reply }
    setMessages((prev) => [...prev, botMsg])
  }, [input, hotProducts, newProducts])

  const onChip = useCallback((topic: string, href: string) => {
    bumpTopic(topic)
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: `[Gợi ý] ${href}` }
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: 'bot',
      text: `Đã ghi nhớ bạn quan tâm "${topic}". Mở link: ${href}`,
    }
    setMessages((prev) => [...prev, userMsg, botMsg])
  }, [])

  const handleDropProduct = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsDropActive(false)
    const raw = event.dataTransfer.getData('application/x-menstuff-product')
    if (!raw) return
    try {
      const product = JSON.parse(raw) as {
        id: string
        name: string
        priceFormatted?: string
        href?: string
        imageUrl?: string
      }
      trackProductClick(product.id)
      const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: `[Kéo vào chat] ${product.name}` }
      const botMsg: Message = {
        id: `b-${Date.now() + 1}`,
        role: 'bot',
        text: `Mẫu "${product.name}" hợp style tối giản, đi chơi hoặc đi làm đều ổn. Bạn có thể phối với vòng tay bạc trơn + dây chuyền mảnh để tổng thể cân bằng hơn.`,
        products: [
          {
            id: product.id,
            name: product.name,
            priceFormatted: product.priceFormatted ?? 'Đang cập nhật',
            href: product.href ?? `${BASE_PATH}/products`,
            imageUrl: product.imageUrl ?? 'https://placehold.co/400x400/f5f5f5/999?text=Product',
            badge: 'HOT',
          },
        ],
      }
      setMessages((prev) => [...prev, userMsg, botMsg])
    } catch {
      // ignore invalid payload
    }
  }, [])

  return (
    <>
      <Button
        type="button"
        size="icon"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full border border-white/15 bg-linear-to-br from-[#0F1115] to-[#1a1d24] text-white shadow-glow-orange focus-visible:ring-2 focus-visible:ring-[#F7931A]"
        aria-label={isOpen ? 'Đóng trợ lý Men Stuffs' : 'Mở trợ lý Men Stuffs'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6 text-[#F7931A]" />}
      </Button>

      {isOpen && (
        <Card
          className="fixed right-6 bottom-24 z-50 flex w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden border-white/10 bg-card/95 p-0 text-card-foreground shadow-[0_0_40px_-12px_rgba(247,147,26,0.35)] backdrop-blur-md"
          role="dialog"
          aria-label="Trợ lý Men Stuffs"
          onDragOver={(event) => {
            event.preventDefault()
            setIsDropActive(true)
          }}
          onDragLeave={() => setIsDropActive(false)}
          onDrop={handleDropProduct}
        >
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-white/10 bg-background/80 px-4 py-3">
            <div>
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Men Stuffs</p>
              <p className="text-sm font-semibold">
                <span className="text-gradient-gold">Trợ lý</span> mua sắm
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px]">
              Beta
            </Badge>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 p-0">
            <div className="flex flex-wrap gap-2 border-b border-white/10 px-4 py-2">
              {suggestions.map((s) => (
                <Button
                  key={s.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 border-white/10 bg-white/5 text-xs hover:bg-white/10"
                  asChild
                >
                  <Link href={s.href} onClick={() => bumpTopic(s.topic)}>
                    {s.label}
                  </Link>
                </Button>
              ))}
            </div>

            <div ref={listRef} className="flex max-h-[280px] min-h-[200px] flex-col gap-3 overflow-y-auto px-4 py-2">
              {isDropActive && (
                <div className="rounded-lg border border-dashed border-[#F7931A]/70 bg-[#F7931A]/10 px-3 py-2 text-center text-xs text-white/80">
                  Thả sản phẩm vào đây để được tư vấn chi tiết
                </div>
              )}
              {messages.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Chọn gợi ý nhanh hoặc hỏi về <strong className="text-foreground">New In</strong>, sản phẩm hot, giỏ hàng.
                  Bạn cũng có thể kéo card sản phẩm từ trang vào khung chat để nhận tư vấn phối đồ.
                </p>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-white/10 bg-muted/40 text-foreground'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    {m.products && m.products.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {m.products.map((p) => (
                          <Link
                            key={`${m.id}-${p.id}`}
                            href={p.href}
                            onClick={() => trackProductClick(p.id)}
                            className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-2 transition hover:border-[#F7931A]/45"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded-md object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-white">{p.name}</p>
                              <p className="text-[11px] text-white/70">{p.priceFormatted}</p>
                            </div>
                            {p.badge && (
                              <span className="rounded-full border border-rose-400/40 bg-rose-500/15 px-2 py-0.5 font-mono text-[10px] tracking-wider text-rose-100">
                                {p.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-2">
              {QUICK_LINKS.map((s) => (
                <Button
                  key={s.topic}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onChip(s.topic, `${typeof window !== 'undefined' ? window.location.origin : ''}${s.href}`)}
                >
                  + {s.label}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 border-t border-white/10 p-3">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi về New In, giá, giỏ hàng…"
                className="border-white/10 bg-background/80"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                className="shrink-0 bg-linear-to-r from-[#EA580C] to-[#F7931A] text-white shadow-glow-orange"
                aria-label="Gửi"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
