import { NextResponse } from "next/server"
import { getAllCategories } from "./services/getAllCategories"

// api url: /api/admin/category
export async function GET() {
  const categories = await getAllCategories()
  return NextResponse.json(categories)
}