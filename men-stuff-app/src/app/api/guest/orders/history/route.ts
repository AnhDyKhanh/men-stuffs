import { NextResponse } from 'next/server'
import { getCustomerOrderHistory } from './services/getCustomerOrderHistory'

export async function GET() {
  const result = await getCustomerOrderHistory()
  return NextResponse.json(result, { status: result.status })
}
