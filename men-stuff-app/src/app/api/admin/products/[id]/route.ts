import { NextResponse } from 'next/server'
import {
  updateProduct,
} from '@/lib/mock-products'
import { deleteProductById, getProductById } from './services/getProductById'

/**
 * GET /api/admin/products/[id]
 * Get product by ID (Supabase public.products, fallback mock)
 */
type GetProductByIdParams = {
  params: Promise<{ id: string }>
}
export async function GET(
  request: Request,
  { params }: GetProductByIdParams,
) {
  const { id } = await params
  const product = await getProductById({ id })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json(product)
}

/**
 * PUT /api/admin/products/[id]
 * Update product
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name_vi, name_en, price, status, thumbnail } = body

    const product = updateProduct(id, {
      name_vi,
      name_en,
      price: price !== undefined ? Number(price) : undefined,
      status,
      thumbnail,
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Delete product
 */
export async function DELETE(
  { params }: GetProductByIdParams,
) {
  const { id } = await params
  const { statusText } = await deleteProductById({ id })

  return NextResponse.json({ statusText })
}
