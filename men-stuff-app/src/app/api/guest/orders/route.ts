import { NextResponse } from 'next/server'
import { getCustomerOrders } from './services/getCustomerOrders'

export async function GET() {
  const result = await getCustomerOrders()
  return NextResponse.json(result, { status: result.status })
}

