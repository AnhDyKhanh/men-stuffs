import { NextResponse } from 'next/server'
import { createProductReview } from './services/createProductReview'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON không hợp lệ' }, { status: 400 })
  }
  const result = await createProductReview(body as Parameters<typeof createProductReview>[0])
  return NextResponse.json(result, { status: result.status })
}
