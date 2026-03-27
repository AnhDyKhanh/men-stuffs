import { NextResponse } from 'next/server'
import { getAllProducts } from './services/getAllProducts'
import { createProduct } from './services/createProducts'
import { ProductStatus } from '@/models'

/**
 * GET /api/admin/products
 * Get all products
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const options = {
    page: parseInt(searchParams.get('page') || '1', 10),
    size: parseInt(searchParams.get('size') || '10', 10),
    orderBy: searchParams.get('orderBy') || 'created_at',
    ascending: searchParams.get('ascending') === 'true',
    search: searchParams.get('search') ?? undefined,
    categoryId: searchParams.get('categoryId')?.split(',') ?? [],
    dateFrom: searchParams.get('dateFrom') ?? undefined,
    dateTo: searchParams.get('dateTo') ?? undefined,
    status: searchParams.get('status') as ProductStatus ?? undefined,
  }

  const result = await getAllProducts(options)
  return Response.json(result)
}

/**
 * POST /api/admin/products
 * Create a new product
 */
export async function POST(request: Request) {
  try {
    // const body = await request.json()
    const formData = await request.formData()

    const body = {
      category_id: formData.get('category_id') as string,
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      discount_price: Number(formData.get('discount_price')),
      material: formData.get('material') as string,
      is_active: formData.get('is_active') as 'active' | 'inactive',
      origin_image: formData.get('origin_image') as File,
    }

    const product = await createProduct(body)

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
