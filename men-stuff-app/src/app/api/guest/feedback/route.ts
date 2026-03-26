import { NextResponse } from 'next/server'
import { submitFeedback } from './services/submitFeedback'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    let rating: number | string | null = null
    let comment = ''
    let product_id: string | null = null
    let order_id: string | null = null
    let imageUrls: string[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      rating = formData.get('rating') as string | null
      comment = String(formData.get('comment') ?? '')
      product_id = (formData.get('product_id') as string | null) ?? null
      order_id = (formData.get('order_id') as string | null) ?? null

      const files = formData.getAll('images').filter((item): item is File => item instanceof File)
      if (files.length > 0) {
        const supabase = getSupabaseAdmin()
        const uploads = await Promise.all(
          files.slice(0, 5).map(async (file) => {
            const ext = file.name.split('.').pop() || 'jpg'
            const fileName = `feedback/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
            const { error: uploadError } = await supabase.storage.from('image').upload(fileName, file)
            if (uploadError) throw uploadError
            return supabase.storage.from('image').getPublicUrl(fileName).data.publicUrl
          }),
        )
        imageUrls = uploads
      }
    } else {
      const body = await request.json()
      rating = body?.rating ?? null
      comment = typeof body?.comment === 'string' ? body.comment : ''
      product_id = body?.product_id ?? null
      order_id = body?.order_id ?? null
      imageUrls = Array.isArray(body?.image_urls) ? body.image_urls.filter(Boolean) : []
    }

    if (typeof rating !== 'number' && typeof rating !== 'string') {
      return NextResponse.json({ error: 'Rating là bắt buộc (1–5)' }, { status: 400 })
    }

    const result = await submitFeedback({
      rating: Number(rating),
      comment,
      product_id,
      order_id,
      image_urls: imageUrls,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status ?? 500 })
    }

    return NextResponse.json({
      data: result.data,
      message: 'Cảm ơn bạn đã gửi phản hồi!',
    })
  } catch (err) {
    console.error('[POST /api/guest/feedback]', err)
    return NextResponse.json({ error: 'Gửi feedback thất bại' }, { status: 500 })
  }
}
