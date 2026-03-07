import { NextResponse } from 'next/server'
import { getAllProducts } from './services/getAllProducts'
import { createProduct } from './services/createProducts'

/**
 * GET /api/admin/products
 * Get all products
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('q') ?? searchParams.get('search');
  const options = {
    page: Math.max(0, parseInt(searchParams.get('page') || '0', 10)),
    size: Math.min(100, Math.max(1, parseInt(searchParams.get('size') || '20', 10))),
    orderBy: searchParams.get('orderBy') || 'created_at',
    ascending: searchParams.get('ascending') === 'true',
    categoryId: categoryParam && categoryParam.trim() ? categoryParam.trim() : undefined,
    search: searchParam && searchParam.trim() ? searchParam.trim() : undefined,
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