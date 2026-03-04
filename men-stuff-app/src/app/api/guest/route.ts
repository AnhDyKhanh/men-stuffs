import { getCustomerAccount } from "./services/getCustomerAccount"
import { NextResponse } from "next/server"

// api/guest
export async function GET() {
  const customerAccount = await getCustomerAccount()
  return NextResponse.json(customerAccount)
}