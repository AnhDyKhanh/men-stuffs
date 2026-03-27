import { BASE_PATH } from '@/lib/labels'

export type StoreNavResult = { href: string; reply: string }

const home = BASE_PATH || '/'

/** Bắt buộc có ý “đi tới trang” hoặc khớp đường dẫn an toàn trong câu. */
function hasNavigationIntent(t: string): boolean {
  return (
    /mở|đưa|chuyển|đi tới|đến trang|dẫn|take me to|open(\s+the)?\s+page|go to|navigate|muốn xem|cho xem|xem trang|đưa tôi|chở tôi/i.test(
      t,
    ) || /^\s*\/[a-z0-9\-/?=&_.]*\s*$/i.test(t)
  )
}

function normalizePath(p: string): string | null {
  const trimmed = p.trim()
  if (!trimmed.startsWith('/')) return null
  if (trimmed.includes('..') || trimmed.startsWith('//')) return null
  if (/^[a-z]+:/i.test(trimmed)) return null
  return trimmed.split('#')[0] || '/'
}

/**
 * Trả về trang đích nếu người dùng muốn được “teleport” tới một màn hình cụ thể.
 */
export function resolveStoreNavigation(userText: string): StoreNavResult | null {
  const raw = userText.trim()
  const t = raw.toLowerCase()

  const onlyPath = normalizePath(raw)
  if (onlyPath) {
    return {
      href: onlyPath,
      reply: `Đã chuyển bạn tới ${onlyPath}.`,
    }
  }

  const pathInSentence = raw.match(/(\/[a-z0-9\-]+(?:\/[a-z0-9\-]+)*(?:\?[a-z0-9_\-=&]+)?)/i)
  if (pathInSentence) {
    const path = normalizePath(pathInSentence[1])
    if (path && hasNavigationIntent(t)) {
      return { href: path, reply: `Đã chuyển bạn tới ${path}.` }
    }
  }

  const wantsPurchaseHistory =
    /lịch sử mua|lịch sử đơn|muốn xem lịch sử|xem lịch sử|coi lịch sử/i.test(t)
  if (wantsPurchaseHistory) {
    return {
      href: `${BASE_PATH}/account?tab=history`,
      reply: 'Đã chuyển bạn tới **Lịch sử mua hàng**.',
    }
  }

  /** Chỉ cần nói muốn / xem / coi / mở… đơn là chuyển thẳng (không cần thêm “mở trang”). */
  const wantsViewOrdersPage =
    /muốn xem đơn|muon xem don|cho xem đơn|cho coi đơn|xem đơn hàng|xem don hang|coi đơn hàng|coi don hang|^xem đơn\s*$|^coi đơn\s*$|mở đơn|vào đơn|vào trang đơn|tới đơn hàng|đến đơn hàng|đi đơn hàng/i.test(t)
  if (wantsViewOrdersPage) {
    return {
      href: `${BASE_PATH}/account?tab=orders`,
      reply: 'Đã chuyển bạn tới **Đơn hàng của tôi**.',
    }
  }

  if (!hasNavigationIntent(t)) return null

  const rules: [RegExp, string, string][] = [
    [
      /đơn hàng|đơn của tôi|theo dõi đơn|kiểm tra đơn|\borders\b|tracking đơn/i,
      `${BASE_PATH}/account?tab=orders`,
      'Đã mở mục **Đơn hàng của tôi** trong Tài khoản — bạn xem tiến độ nhận tại shop tại đó.',
    ],
    [
      /đăng nhập|login/i,
      `${BASE_PATH}/login`,
      'Đã mở trang **Đăng nhập**.',
    ],
    [
      /tài khoản|hồ sơ|\bprofile\b/i,
      `${BASE_PATH}/account`,
      'Đã mở trang **Tài khoản**.',
    ],
    [
      /giỏ|giỏ hàng|^cart$/i,
      `${BASE_PATH}/cart`,
      'Đã mở **Giỏ hàng**.',
    ],
    [
      /thanh toán|checkout|đặt hàng|điền đơn/i,
      `${BASE_PATH}/checkout`,
      'Đã mở trang **Thanh toán** (checkout).',
    ],
    [
      /trang chủ|^home$|về đầu trang/i,
      home,
      'Đã về **Trang chủ**.',
    ],
    [
      /new\s*in|hàng mới|mới về/i,
      `${BASE_PATH}/new-in`,
      'Đã mở **New In**.',
    ],
    [
      /shop all|tất cả sản phẩm|danh sách sản phẩm|mua đồ|cửa hàng|trang sản phẩm|xem sản phẩm/i,
      `${BASE_PATH}/products`,
      'Đã mở **Tất cả sản phẩm**.',
    ],
    [
      /bộ sưu tập|collection/i,
      `${BASE_PATH}/collections`,
      'Đã mở **Bộ sưu tập**.',
    ],
    [
      /liên hệ|feedback|hỗ trợ|contact/i,
      `${BASE_PATH}/pages/contact`,
      'Đã mở trang **Liên hệ**.',
    ],
    [
      /về chúng tôi|giới thiệu|about/i,
      `${BASE_PATH}/pages/about`,
      'Đã mở trang **Về chúng tôi**.',
    ],
  ]

  for (const [re, href, reply] of rules) {
    if (re.test(t)) return { href, reply }
  }

  return null
}
