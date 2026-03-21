/**
 * Client-only: lưu thói quen nhẹ (localStorage) để gợi ý nhanh / phản hồi phù hợp.
 * Không gửi dữ liệu lên server — tránh phức tạp privacy khi demo.
 */

const STORAGE_KEY = 'menstuffs_chat_habits_v1'

export type ChatbotHabits = {
  /** Số lần bấm gợi ý / liên quan New In */
  newInScore: number
  /** Số lần quan tâm sản phẩm / giá */
  productScore: number
  /** Số lần hỏi giỏ / mua */
  cartScore: number
  /** Các path gần đây (tối đa 8) */
  recentPaths: string[]
  updatedAt: string
}

function defaultHabits(): ChatbotHabits {
  return {
    newInScore: 0,
    productScore: 0,
    cartScore: 0,
    recentPaths: [],
    updatedAt: new Date().toISOString(),
  }
}

export function loadHabits(): ChatbotHabits {
  if (typeof window === 'undefined') return defaultHabits()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultHabits()
    const parsed = JSON.parse(raw) as Partial<ChatbotHabits>
    return { ...defaultHabits(), ...parsed, recentPaths: parsed.recentPaths ?? [] }
  } catch {
    return defaultHabits()
  }
}

function saveHabits(h: ChatbotHabits) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...h, updatedAt: new Date().toISOString() }))
}

export function recordPathVisit(pathname: string) {
  const h = loadHabits()
  const nextPaths = [pathname, ...h.recentPaths.filter((p) => p !== pathname)].slice(0, 8)
  if (pathname.startsWith('/new-in')) h.newInScore += 1
  if (pathname.startsWith('/product') || pathname.startsWith('/products')) h.productScore += 1
  if (pathname.startsWith('/cart') || pathname.startsWith('/checkout')) h.cartScore += 1
  h.recentPaths = nextPaths
  saveHabits(h)
}

export type SuggestionChip = { id: string; label: string; href: string }

export function getSuggestionChips(pathname: string, habits: ChatbotHabits): SuggestionChip[] {
  const core: SuggestionChip[] = [
    { id: 'new-in', label: 'New In', href: '/new-in' },
    { id: 'products', label: 'Sản phẩm', href: '/products' },
    { id: 'cart', label: 'Giỏ hàng', href: '/cart' },
    { id: 'account', label: 'Tài khoản', href: '/account' },
  ]

  // Ưu tiên New In nếu user hay xem hoặc đang ở home
  const boostNewIn = habits.newInScore >= 2 || pathname === '/' || pathname.startsWith('/new-in')
  if (boostNewIn) {
    return [
      { id: 'new-in', label: '🔥 New In cho bạn', href: '/new-in' },
      ...core.filter((c) => c.id !== 'new-in'),
    ]
  }

  if (habits.cartScore >= 2) {
    return [
      { id: 'cart', label: 'Tiếp tục thanh toán?', href: '/cart' },
      ...core.filter((c) => c.id !== 'cart'),
    ]
  }

  return core
}

export type BotReply = {
  text: string
  followUp?: SuggestionChip[]
}

export function buildBotReply(userText: string, pathname: string): BotReply {
  const t = userText.toLowerCase().trim()

  if (/new|mới|new in|hàng mới/.test(t)) {
    return {
      text: 'Bạn có thể xem các sản phẩm mới nhất ở trang New In — mình đã ưu tiên gợi ý này nếu bạn hay quan tâm mục đó.',
      followUp: [{ id: 'new-in', label: 'Đi tới New In', href: '/new-in' }],
    }
  }

  if (/giá|bao nhiêu|tiền|đắt|rẻ/.test(t)) {
    return {
      text: 'Giá hiển thị theo VND trên từng sản phẩm. Bạn có thể lọc ở trang danh sách sản phẩm.',
      followUp: [{ id: 'products', label: 'Xem sản phẩm', href: '/products' }],
    }
  }

  if (/giỏ|cart|thanh toán|checkout/.test(t)) {
    return {
      text: 'Giỏ hàng và thanh toán nằm ở mục Giỏ hàng / Thanh toán. Nếu bạn đang xem New In, thêm vào giỏ rồi qua checkout nhé.',
      followUp: [
        { id: 'cart', label: 'Mở giỏ hàng', href: '/cart' },
        { id: 'new-in', label: 'Quay lại New In', href: '/new-in' },
      ],
    }
  }

  if (/size|chọn size|mặc/.test(t)) {
    return {
      text: 'Bạn có thể xem mô tả chi tiết trên trang sản phẩm. Nếu cần tư vấn size, cho mình biết loại đồ (áo/quần/giày) nhé.',
    }
  }

  return {
    text:
      pathname.startsWith('/new-in')
        ? 'Bạn đang ở New In — lướt xem các món mới; thêm vào giỏ nếu ưng ý. Mình có thể gợi ý thêm nếu bạn nói rõ bạn thích style gì (street, minimal, formal…).'
        : 'Chào bạn! Mình có thể gợi ý lối tắt tới New In, sản phẩm hoặc giỏ hàng. Thử bấm các gợi ý phía dưới hoặc hỏi về giá / size nhé.',
    followUp: [
      { id: 'new-in', label: 'New In', href: '/new-in' },
      { id: 'products', label: 'Sản phẩm', href: '/products' },
    ],
  }
}

export function recordChipClick(chipId: string) {
  const h = loadHabits()
  if (chipId === 'new-in') h.newInScore += 2
  if (chipId === 'products') h.productScore += 1
  if (chipId === 'cart') h.cartScore += 1
  saveHabits(h)
}
