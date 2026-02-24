import { NextResponse } from 'next/server'
import { getAllProducts } from './services/getAllProducts'
import { createProduct } from './services/createProducts'

/**
 * GET /api/admin/products
 * Get all products
 */
export async function GET() {
  const products = await getAllProducts()
  return NextResponse.json(products)
}

/**
 * POST /api/admin/products
 * Create a new product
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await createProduct(body)

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}