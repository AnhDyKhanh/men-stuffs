import { NextResponse } from 'next/server'
import { createProduct } from '@/lib/mock-products'
import { getAllProducts } from './services/getAllProducts'

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
    const { name_vi, name_en, price, status, thumbnail } = body

    if (!name_vi || !name_en || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const product = createProduct({
      name_vi,
      name_en,
      price: Number(price),
      status: status || 'active',
      thumbnail: thumbnail || '',
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Failed to create product', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 },
    )
  }
}
