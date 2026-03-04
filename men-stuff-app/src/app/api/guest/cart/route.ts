import { getUserCartItems } from "./services/getUserCartItems"
import { NextResponse } from "next/server"

// api/guest/cart
export async function GET() {
  const cartItems = await getUserCartItems()
  return NextResponse.json(cartItems)
}