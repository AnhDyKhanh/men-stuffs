import { NextResponse } from 'next/server'
import { getAllProducts } from './services/getAllProducts'
import { createProduct } from './services/createProducts'

/**
 * GET /api/admin/products
 * Get all products
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const options = {
    page: parseInt(searchParams.get('page') || '1', 10),
    size: parseInt(searchParams.get('size') || '10', 10),
    orderBy: searchParams.get('orderBy') || 'created_at',
    ascending: searchParams.get('ascending') === 'true',
    search: searchParams.get('search') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    dateFrom: searchParams.get('dateFrom') ?? undefined,
    dateTo: searchParams.get('dateTo') ?? undefined,
  };

  const result = await getAllProducts(options);
  return Response.json(result);
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
