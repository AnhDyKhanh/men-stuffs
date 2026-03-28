import { getSupabaseAdmin } from '@/lib/supabase'
import { getCurrentCustomerId } from '@/app/api/guest/services/getCustomerAccount'

const REVIEWABLE = new Set(['picked_up', 'delivered'])

export type CreateReviewBody = {
  order_id: string
  product_id: string
  rating: number
  comment?: string | null
  image_urls?: string[]
}

export async function createProductReview(body: CreateReviewBody) {
  const customerIdRaw = await getCurrentCustomerId().catch(() => null)
  const customerId = typeof customerIdRaw === 'string' ? customerIdRaw : null

  if (!customerId) {
    return { data: null, error: 'Unauthorized', status: 401 }
  }

  const orderId = body.order_id?.trim()
  const productId = body.product_id?.trim()
  const rating = Number(body.rating)
  const comment = body.comment?.trim() ?? null
  const image_urls = Array.isArray(body.image_urls) ? body.image_urls.filter((u) => typeof u === 'string' && u.startsWith('http')) : []

  if (!orderId || !productId || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { data: null, error: 'Thiếu thông tin hoặc số sao không hợp lệ (1–5)', status: 400 }
  }

  if (image_urls.length > 5) {
    return { data: null, error: 'Tối đa 5 ảnh', status: 400 }
  }

  const supabase = getSupabaseAdmin()

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, customer_id, status')
    .eq('id', orderId)
    .single()

  if (orderErr || !order) {
    return { data: null, error: 'Không tìm thấy đơn hàng', status: 404 }
  }

  if (String(order.customer_id) !== customerId) {
    return { data: null, error: 'Không thể đánh giá đơn của người khác', status: 403 }
  }

  const st = order.status as string | null
  if (!st || !REVIEWABLE.has(st)) {
    return { data: null, error: 'Chỉ đánh giá được sau khi đơn đã hoàn thành nhận hàng', status: 400 }
  }

  const { data: lineRow } = await supabase
    .from('order_item')
    .select('id')
    .eq('order_id', orderId)
    .eq('product_id', productId)
    .limit(1)
    .maybeSingle()

  let hasLine = !!lineRow
  if (!hasLine) {
    const { data: ord } = await supabase.from('orders').select('cart_id').eq('id', orderId).single()
    const cartId = ord?.cart_id as string | null
    if (cartId) {
      const { data: ci } = await supabase
        .from('cart_items')
        .select('id')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .limit(1)
        .maybeSingle()
      hasLine = !!ci
    }
  }

  if (!hasLine) {
    return { data: null, error: 'Sản phẩm không thuộc đơn này', status: 400 }
  }

  const { data: inserted, error: insErr } = await supabase
    .from('product_review')
    .insert({
      order_id: orderId,
      product_id: productId,
      customer_id: customerId,
      rating: Math.round(rating),
      comment: comment || null,
      image_urls,
    })
    .select('id, order_id, product_id, rating, comment, image_urls, created_at')
    .single()

  if (insErr) {
    if (/duplicate|unique/i.test(insErr.message)) {
      return { data: null, error: 'Bạn đã đánh giá sản phẩm này trong đơn rồi', status: 409 }
    }
    return { data: null, error: insErr.message, status: 500 }
  }

  return { data: inserted, error: null, status: 201 }
}
