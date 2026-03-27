'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { API_ROUTES } from '@/constants/apiRouter'
import { BASE_PATH } from '@/lib/labels'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import { getHotProductIdsToday, trackProductClick } from '@/lib/productHot'
import type { Product } from '@/models/product'
import { getOrderStatusLabel } from '@/constants/orderStatus'
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
    return `Bạn có thể xem hàng mới tại trang New In — mình ưu tiên gợi ý này khi bạn hỏi về sản phẩm mới. Mở: ${BASE_PATH}/new-in`
  }
  if (/giỏ|cart|thanh toán|checkout/i.test(t)) {
    return `Giỏ hàng & thanh toán: xem giỏ tại ${BASE_PATH}/cart và thanh toán tại ${BASE_PATH}/checkout khi bạn đã đăng nhập.`
  }
  if (/nhận tại shop|pickup|lấy tại shop|cửa hàng/i.test(t)) {
    return `Bạn có thể chọn nhận tại shop ngay ở bước checkout. Luồng trạng thái sẽ đi theo: đã nhận đơn -> đang chuẩn bị -> đã sẵn sàng -> đã nhận hàng.`
  }
  if (/giao tận nhà|giao về nhà|ship về nhà/i.test(t)) {
    return `Nhận hàng tại nhà hiện đang ở trạng thái Coming soon. Bạn có thể dùng nhận tại shop để đặt đơn ngay.`
  }
  if (/liên hệ|contact|hotline|hỗ trợ/i.test(t)) {
    return `Bạn có thể vào trang liên hệ tại ${BASE_PATH}/pages/contact hoặc nhắn trực tiếp trong khung chat này, mình sẽ hướng dẫn nhanh cho bạn.`
  }
  if (/đổi trả|hoàn tiền|refund/i.test(t)) {
    return `Để hỗ trợ đổi trả/hoàn tiền nhanh nhất, bạn gửi mã đơn + lý do ở trang liên hệ ${BASE_PATH}/pages/contact để team xử lý.`
  }
  if (/collection|bộ sưu tập|combo/i.test(t)) {
    return `Bạn có thể xem bộ sưu tập tại ${BASE_PATH}/collections và thêm từng món hoặc thêm cả bộ vào giỏ hàng.`
  }
  if (/giá|sale|giảm/i.test(t)) {
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

function linePrice(p: Product): number {
  const base = p.price ?? 0
  const d = p.discount_price
  if (d != null && d > 0 && d < base) return d
  return base
}

function ts(created: Product['created_at']): number {
  if (!created) return 0
  const t = new Date(created as unknown as string).getTime()
  return Number.isFinite(t) ? t : 0
}

/** Rẻ nhất / đắt nhất / mới nhất — theo batch sản phẩm đang tải. */
function buildCatalogSummary(products: Product[]): string | null {
  if (!products.length) return null
  const priced = products.map((p) => ({ p, v: linePrice(p) })).filter((x) => x.v > 0)
  if (!priced.length) return null
  const byMoney = [...priced].sort((a, b) => a.v - b.v)
  const cheapest = byMoney[0]
  const expensive = byMoney[byMoney.length - 1]
  const newestP = [...products].sort((a, b) => ts(b.created_at) - ts(a.created_at))[0]
  const nv = linePrice(newestP)
  return [
    `Trong danh mục đang xem được:`,
    `• Rẻ nhất: "${cheapest.p.name ?? '—'}" — ${formatPrice(cheapest.v)}`,
    `• Đắt nhất: "${expensive.p.name ?? '—'}" — ${formatPrice(expensive.v)}`,
    `• Mới nhất: "${newestP.name ?? '—'}" — ${formatPrice(nv)}`,
  ].join('\n')
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [orderAlertCount, setOrderAlertCount] = useState(0)
  const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs())
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Message[]
      return Array.isArray(parsed) ? parsed.slice(-40) : []
    } catch {
      return []
    }
  })
  const [input, setInput] = useState('')
  const [isDropActive, setIsDropActive] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const { data: productsResponse } = useGetAllProducts({
    page: 1,
    size: 120,
    orderBy: 'created_at',
    ascending: false,
    status: 'active',
  })

  const suggestions = useMemo(() => rankedSuggestions(prefs).slice(0, 4), [prefs])
  const rawProducts = useMemo(
    () => ((productsResponse as { data?: Product[] })?.data ?? []) as Product[],
    [productsResponse],
  )

  const catalogSummary = useMemo(() => buildCatalogSummary(rawProducts), [rawProducts])

  const allProducts = useMemo((): ChatProduct[] => {
    return rawProducts.map((p) => ({
      id: p.id,
      name: p.name ?? 'Sản phẩm',
      priceFormatted: formatPrice(linePrice(p)),
      imageUrl: p.origin_image || 'https://placehold.co/400x400/f5f5f5/999?text=Product',
      href: `${BASE_PATH}/product/${p.slug || p.id}`,
    }))
  }, [rawProducts])

  const hotProducts = useMemo(() => {
    const hotIds = new Set(getHotProductIdsToday(6))
    const hot = allProducts.filter((p) => hotIds.has(p.id)).map((p) => ({ ...p, badge: 'HOT' as const }))
    return hot.slice(0, 4)
  }, [allProducts])

  const newProducts = useMemo(() => {
    return allProducts.slice(0, 4).map((p) => ({ ...p, badge: 'NEW' as const }))
  }, [allProducts])

  const recordTopic = useCallback((topic: string) => {
    bumpTopic(topic)
    setPrefs(loadPrefs())
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  useEffect(() => {
    if (typeof window === 'undefined' || messages.length === 0) return
    try {
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(messages.slice(-40)))
    } catch {
      /* ignore */
    }
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text) return

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    const lower = text.toLowerCase()
    if (/new\s*in|mới|hàng mới|arrival/i.test(lower)) recordTopic('new_in')
    if (/giỏ|cart|thanh toán|checkout/i.test(lower)) recordTopic('cart')
    if (/giá|sale|giảm|sản phẩm|products/i.test(lower)) recordTopic('products')
    if (/liên hệ|contact|hỗ trợ|hotline/i.test(lower)) recordTopic('contact')

    const asksCart = /giỏ|cart|trong giỏ|xem giỏ|giỏ hàng/i.test(lower)
    const asksOrderStatus = /đơn|order|trang thái|chuẩn bị|sẵn sàng|nhận hàng/i.test(lower)
    if (asksCart) {
      bumpTopic('cart')
      try {
        const res = await fetch(`${BASE_PATH}/api/guest/cart`, { cache: 'no-store', credentials: 'include' })
        const json = (await res.json()) as {
          data?: { cartItems?: Array<{ quantity: number; price: number; product: { name?: string } }> }
        }
        const items = json?.data?.cartItems ?? []
        if (!res.ok || json?.data === undefined) {
          setMessages((prev) => [
            ...prev,
            {
              id: `b-${Date.now()}`,
              role: 'bot',
              text:
                'Mình không đọc được giỏ lúc này — thường là bạn chưa đăng nhập (giỏ gắn với tài khoản). Đăng nhập rồi mở Giỏ hàng trên menu. Dưới đây là vài gợi ý để bạn xem trước:',
              products: newProducts.slice(0, 3),
            },
          ])
          return
        }
        if (items.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: `b-${Date.now()}`,
              role: 'bot',
              text:
                'Giỏ của bạn đang trống — thêm vài món đi cho vui. Dưới đây là gợi ý nhanh (bấm để xem chi tiết):',
              products: newProducts.slice(0, 4),
            },
          ])
          return
        }
        const lines = items.map((it) => {
          const lineTotal = it.price * it.quantity
          return `• ${it.product?.name ?? 'Sản phẩm'} × ${it.quantity} — ${formatPrice(lineTotal)}`
        })
        const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0)
        const cartText = `Trong giỏ của bạn:\n${lines.join('\n')}\nTạm tính: ${formatPrice(subtotal)}`
        setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: 'bot', text: cartText }])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            role: 'bot',
            text: 'Không tải được giỏ. Mở trang Giỏ hàng trên menu hoặc thử lại sau.',
          },
        ])
      }
      return
    }

    if (asksOrderStatus) {
      try {
        const res = await fetch(API_ROUTES.GUEST.ORDERS, { cache: 'no-store', credentials: 'include' })
        const json = (await res.json()) as {
          data?: { orders?: Array<{ order_code: string | null; status: string | null }>; processingCount?: number }
        }
        const orders = json?.data?.orders ?? []
        if (!res.ok || orders.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: `b-${Date.now()}`,
              role: 'bot',
              text: 'Bạn chưa có đơn nào gần đây. Khi đặt đơn nhận tại shop, mình sẽ cập nhật tiến độ cho bạn.',
            },
          ])
          return
        }
        const lines = orders.slice(0, 3).map((order) => {
          return `• ${order.order_code ?? 'Đơn gần nhất'}: ${getOrderStatusLabel(order.status)}`
        })
        const processing = Number(json?.data?.processingCount ?? 0)
        const hasReady = orders.some((order) => order.status === 'ready_for_pickup')
        const tail = hasReady
          ? 'Có đơn đã sẵn sàng, bạn có thể đến shop nhận hàng.'
          : processing > 0
            ? `Hiện còn ${processing} đơn đang xử lý.`
            : 'Tất cả đơn đang ở trạng thái hoàn tất.'
        setMessages((prev) => [
          ...prev,
          { id: `b-${Date.now()}`, role: 'bot', text: `Tiến độ đơn hàng:\n${lines.join('\n')}\n${tail}` },
        ])
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: `b-${Date.now()}`, role: 'bot', text: 'Không tải được trạng thái đơn lúc này. Thử lại sau nhé.' },
        ])
      }
      return
    }

    const asksPriceFacts =
      /đắt nhất|rẻ nhất|giá cao|giá thấp|expensive|cheap|mới nhất|mới ra|hàng mới|giá|bao nhiêu|khoảng giá/i.test(
        lower,
      )
    if (asksPriceFacts) {
      bumpTopic('products')
      if (catalogSummary) {
        setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: 'bot', text: catalogSummary }])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            role: 'bot',
            text: `Chưa có dữ liệu sản phẩm để so sánh giá lúc này. Xem danh sách tại ${BASE_PATH}/products hoặc New In ${BASE_PATH}/new-in.`,
          },
        ])
      }
      return
    }

    const asksConsulting =
      /tư vấn|tu van|goi y|gợi ý|nên mua|mua gì|phối|mix|match|hot|best/.test(lower) && !asksPriceFacts

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
  }

  useEffect(() => {
    let mounted = true
    const loadOrderAlerts = async () => {
      try {
        const res = await fetch(API_ROUTES.GUEST.ORDERS, { cache: 'no-store', credentials: 'include' })
        if (!res.ok) return
        const json = (await res.json()) as {
          data?: { processingCount?: number; orders?: Array<{ status: string | null }> }
        }
        const processing = Number(json?.data?.processingCount ?? 0)
        const readyCount = (json?.data?.orders ?? []).filter((item) => item.status === 'ready_for_pickup').length
        if (mounted) setOrderAlertCount(processing + readyCount)
      } catch {
        if (mounted) setOrderAlertCount(0)
      }
    }
    void loadOrderAlerts()
    const timer = setInterval(() => void loadOrderAlerts(), 20000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const onChip = useCallback((topic: string, href: string) => {
    recordTopic(topic)
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: `[Gợi ý] ${href}` }
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: 'bot',
      text: `Đã ghi nhớ bạn quan tâm "${topic}". Mở link: ${href}`,
    }
    setMessages((prev) => [...prev, userMsg, botMsg])
  }, [recordTopic])

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
      const rawValue = Number((product.priceFormatted ?? '').replace(/[^\d]/g, ''))
      const related = allProducts
        .filter((item) => item.id !== product.id)
        .filter((item) => {
          const itemValue = Number(item.priceFormatted.replace(/[^\d]/g, ''))
          if (!rawValue || !itemValue) return true
          return itemValue >= rawValue * 0.65 && itemValue <= rawValue * 1.35
        })
        .slice(0, 3)
      const botMsg: Message = {
        id: `b-${Date.now() + 1}`,
        role: 'bot',
        text: `Mẫu "${product.name}" hợp style tối giản, đi chơi hoặc đi làm đều ổn. Gợi ý phối nhanh: 1 item làm điểm nhấn + 1 item nền trung tính để tổng thể cân bằng hơn. Dưới đây là vài món liên quan cùng tầm giá để bạn mix thêm:`,
        products: [
          {
            id: product.id,
            name: product.name,
            priceFormatted: product.priceFormatted ?? 'Đang cập nhật',
            href: product.href ?? `${BASE_PATH}/products`,
            imageUrl: product.imageUrl ?? 'https://placehold.co/400x400/f5f5f5/999?text=Product',
            badge: 'HOT',
          },
          ...related,
        ],
      }
      setMessages((prev) => [...prev, userMsg, botMsg])
    } catch {
      // ignore invalid payload
    }
  }, [allProducts])

  return (
    <>
      <Button
        type="button"
        size="icon"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full border border-white/15 bg-linear-to-br from-[#0F1115] to-[#1a1d24] text-white shadow-glow-orange focus-visible:ring-2 focus-visible:ring-[#F7931A]"
        aria-label={isOpen ? 'Đóng trợ lý Men Stuffs' : 'Mở trợ lý Men Stuffs'}
      >
        {orderAlertCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
            {orderAlertCount > 99 ? '99+' : orderAlertCount}
          </span>
        )}
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6 text-[#F7931A]" />}
      </Button>

      {isOpen && (
        <Card
          className="fixed right-4 top-20 z-50 flex h-[min(680px,calc(100dvh-6rem))] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden border-white/10 bg-card/95 p-0 text-card-foreground shadow-[0_0_40px_-12px_rgba(247,147,26,0.35)] backdrop-blur-md sm:right-6"
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
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-[10px]">
                Beta
              </Badge>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng chatbot"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-0">
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

            <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-2">
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
                    className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${m.role === 'user'
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

            <div className="mt-auto flex shrink-0 gap-2 border-t border-white/10 bg-background/95 p-3">
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
