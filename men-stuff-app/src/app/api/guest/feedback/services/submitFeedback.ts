import { getSupabase } from '@/lib/supabase'
import { getCurrentCustomerId } from '../../services/getCustomerAccount'

export type SubmitFeedbackDTO = {
  rating: number
  comment: string
  product_id?: string | null
  order_id?: string | null
}

export async function submitFeedback(body: SubmitFeedbackDTO) {
  const { rating, comment, product_id, order_id } = body
  const validRating = Math.min(5, Math.max(1, Number(rating)))
  const trimmedComment = typeof comment === 'string' ? comment.trim() : ''

  try {
    const supabase = getSupabase()
    const customerId = await getCurrentCustomerId().catch(() => null)

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        customer_id: customerId ?? null,
        product_id: product_id ?? null,
        order_id: order_id ?? null,
        rating: validRating,
        comment: trimmedComment || null,
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
