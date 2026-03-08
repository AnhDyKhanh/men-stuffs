import { NextResponse } from "next/server"
import { createOrder } from "./services/createPayment"

export async function POST(request: Request) {
  const body = await request.json()
  console.log('body', body)
  const result = await createOrder(body)
  return NextResponse.json(result)
}