import { getSupabase } from '@/lib/supabase'
import { getCurrentCustomerId } from '../../services/getCustomerAccount'

export type SubmitFeedbackDTO = {
  rating: number
  comment: string
  product_id?: string | null
  order_id?: string | null
  image_urls?: string[]
}

export async function submitFeedback(body: SubmitFeedbackDTO) {
  const { rating, comment, product_id, order_id, image_urls = [] } = body
  const validRating = Math.min(5, Math.max(1, Number(rating)))
  const trimmedComment = typeof comment === 'string' ? comment.trim() : ''

  try {
    const supabase = getSupabase()
    const customerIdRaw = await getCurrentCustomerId().catch(() => null)
    const customerId = typeof customerIdRaw === 'string' ? customerIdRaw : null
    const normalizedImages = image_urls.filter(Boolean).slice(0, 5)
    const finalComment =
      normalizedImages.length > 0
        ? `${trimmedComment}${trimmedComment ? '\n\n' : ''}Ảnh đính kèm:\n${normalizedImages.join('\n')}`
        : trimmedComment

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        customer_id: customerId ?? null,
        product_id: product_id ?? null,
        order_id: order_id ?? null,
        rating: validRating,
        comment: finalComment || null,
      })
      .select('id')
      .single()

    if (error) throw error

    return { data: { id: data?.id }, error: null, status: 200 }
  } catch (err: unknown) {
    console.error('[submitFeedback]', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Gửi feedback thất bại',
      status: 500,
    }
  }
}
