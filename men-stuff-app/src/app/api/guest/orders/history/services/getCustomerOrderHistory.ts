import { getSupabase, getSupabaseAdmin } from '@/lib/supabase'
import { getCurrentCustomerId } from '@/app/api/guest/services/getCustomerAccount'
import type { HistoryLine, HistoryOrder, HistoryProduct, HistoryReview } from '@/types/guestOrderHistory'
export type { HistoryLine, HistoryOrder, HistoryProduct, HistoryReview } from '@/types/guestOrderHistory'

function normProduct(raw: unknown): HistoryProduct | null {
  if (!raw) return null
  const p = (Array.isArray(raw) ? raw[0] : raw) as {
    id?: string
    name?: string | null
    origin_image?: string | null
    slug?: string | null
  }
  if (!p?.id) return null
  return {
    id: String(p.id),
    name: p.name ?? '',
    origin_image: p.origin_image ?? null,
    slug: p.slug ?? null,
  }
}

export async function getCustomerOrderHistory() {
  const customerIdRaw = await getCurrentCustomerId().catch(() => null)
  const customerId = typeof customerIdRaw === 'string' ? customerIdRaw : null

  if (!customerId) {
    return { data: { orders: [] as HistoryOrder[] }, error: 'Unauthorized', status: 401 }
  }

  const supabase = getSupabase()

  const { data: ordersRaw, error: ordersError } = await supabase
    .from('orders')
    .select('id, order_code, status, created_at, total_amount, cart_id')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (ordersError) {
    return { data: { orders: [] as HistoryOrder[] }, error: ordersError.message, status: 500 }
  }

  const orders = (ordersRaw ?? []) as Array<{
    id: string
    order_code: string | null
    status: string | null
    created_at: string | null
    total_amount: number | null
    cart_id: string | null
  }>

  const orderIds = orders.map((o) => o.id)
  if (orderIds.length === 0) {
    return { data: { orders: [] as HistoryOrder[] }, error: null, status: 200 }
  }

  const { data: orderItemsRaw, error: oiError } = await supabase
    .from('order_item')
    .select('id, order_id, product_id, quantity, price, product:product_id(id, name, origin_image, slug)')
    .in('order_id', orderIds)

  if (oiError) {
    return { data: { orders: [] as HistoryOrder[] }, error: oiError.message, status: 500 }
  }

  const byOrder = new Map<string, Omit<HistoryLine, 'review'>[]>()
  for (const row of orderItemsRaw ?? []) {
    const r = row as {
      id: string
      order_id: string
      product_id: string | null
      quantity: number | null
      price: number | null
      product?: unknown
    }
    const arr = byOrder.get(r.order_id) ?? []
    arr.push({
      id: r.id,
      product_id: r.product_id ?? '',
      quantity: Number(r.quantity ?? 0),
      price: Number(r.price ?? 0),
      product: normProduct(r.product),
    })
    byOrder.set(r.order_id, arr)
  }

  const needCart = orders.filter((o) => (byOrder.get(o.id)?.length ?? 0) === 0 && o.cart_id)
  const cartIds = [...new Set(needCart.map((o) => o.cart_id).filter(Boolean))] as string[]

  if (cartIds.length > 0) {
    const { data: cartLines, error: ciErr } = await supabase
      .from('cart_items')
      .select('id, cart_id, quantity, price_at_time, product_id, product:product_id(id, name, origin_image, slug)')
      .in('cart_id', cartIds)

    if (!ciErr && cartLines?.length) {
      const cartToOrder = new Map<string, string>()
      for (const o of needCart) {
        if (o.cart_id) cartToOrder.set(o.cart_id, o.id)
      }
      for (const row of cartLines) {
        const r = row as {
          id: string
          cart_id: string
          quantity: number | null
          price_at_time: number | null
          product_id: string | null
          product?: unknown
        }
        const oid = cartToOrder.get(r.cart_id)
        if (!oid) continue
        const arr = byOrder.get(oid) ?? []
        arr.push({
          id: `cart-${r.id}`,
          product_id: r.product_id ?? '',
          quantity: Number(r.quantity ?? 0),
          price: Number(r.price_at_time ?? 0),
          product: normProduct(r.product),
        })
        byOrder.set(oid, arr)
      }
    }
  }

  const reviewMap = new Map<string, HistoryReview>()
  if (orderIds.length > 0) {
    const { data: reviews, error: revErr } = await getSupabaseAdmin()
      .from('product_review')
      .select('id, order_id, product_id, rating, comment, image_urls, created_at')
      .eq('customer_id', customerId)
      .in('order_id', orderIds)

    if (revErr) {
      console.warn('[getCustomerOrderHistory] product_review:', revErr.message)
    }

    for (const rev of reviews ?? []) {
      const z = rev as {
        id: string
        order_id: string
        product_id: string
        rating: number
        comment: string | null
        image_urls: string[] | null
        created_at: string
      }
      reviewMap.set(`${z.order_id}:${z.product_id}`, {
        id: z.id,
        rating: z.rating,
        comment: z.comment,
        image_urls: Array.isArray(z.image_urls) ? z.image_urls : [],
        created_at: z.created_at,
      })
    }
  }

  const result: HistoryOrder[] = orders.map((o) => {
    const lines = (byOrder.get(o.id) ?? []).map((line) => ({
      ...line,
      review: reviewMap.get(`${o.id}:${line.product_id}`) ?? null,
    }))
    return {
      id: o.id,
      order_code: o.order_code,
      status: o.status,
      created_at: o.created_at,
      total_amount: o.total_amount,
      items: lines,
    }
  })

  return { data: { orders: result }, error: null, status: 200 }
}
