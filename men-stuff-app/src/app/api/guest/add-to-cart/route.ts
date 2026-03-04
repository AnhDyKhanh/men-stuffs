import { NextResponse } from "next/server"
import { addProductToCart } from "../services/addProductToCart"

// api/guest/add-to-cart
export async function POST(request: Request) {
  const body = await request.json()
  console.log('body', body)
  const result = await addProductToCart(body)
  return NextResponse.json(result)
}