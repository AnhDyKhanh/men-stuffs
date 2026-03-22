import { NextResponse } from 'next/server'
import { getAllOrders } from './services/getAllOrders'

/**
 * GET /api/admin/orders
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = await getAllOrders({
    page: parseInt(searchParams.get('page') || '1', 10),
    size: parseInt(searchParams.get('size') || '20', 10),
    status: searchParams.get('status'),
    search: searchParams.get('search'),
  })
  return NextResponse.json(result)
}
