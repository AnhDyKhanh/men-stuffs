import { NextResponse } from 'next/server'
import { submitFeedback } from './services/submitFeedback'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rating, comment, product_id, order_id } = body

    if (typeof rating !== 'number' && typeof rating !== 'string') {
      return NextResponse.json(
        { error: 'Rating là bắt buộc (1–5)' },
        { status: 400 }
      )
    }

    const result = await submitFeedback({
      rating: Number(rating),
      comment: typeof comment === 'string' ? comment : '',
      product_id: body.product_id ?? null,
      order_id: body.order_id ?? null,
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status ?? 500 }
      )
    }

    return NextResponse.json({
      data: result.data,
      message: 'Cảm ơn bạn đã gửi phản hồi!',
    })
  } catch (err) {
    console.error('[POST /api/guest/feedback]', err)
    return NextResponse.json(
      { error: 'Gửi feedback thất bại' },
      { status: 500 }
    )
  }
}
