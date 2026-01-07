import { NextResponse } from 'next/server';
import { createProduct, getAllProducts } from '@/lib/mock-products';

/**
 * GET /api/admin/products
 * Get all products
 */
export async function GET() {
  const products = getAllProducts();
  return NextResponse.json(products);
}

/**
 * POST /api/admin/products
 * Create a new product
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name_vi, name_en, price, status, thumbnail } = body;

    if (!name_vi || !name_en || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = createProduct({
      name_vi,
      name_en,
      price: Number(price),
      status: status || 'active',
      thumbnail: thumbnail || '/placeholder-product.jpg',
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

