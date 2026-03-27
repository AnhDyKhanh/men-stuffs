import { NextResponse } from 'next/server'
import { getProductById } from './services/getProductById'
import { uploadImage } from '@/app/api/services/uploadImage'
import { getSupabase } from '@/lib/supabase'

/**
 * GET /api/admin/products/[id]
 * Get product by ID (Supabase public.products, fallback mock)
 */
type GetProductByIdParams = {
  params: Promise<{ id: string }>
}
export async function GET(request: Request, { params }: GetProductByIdParams) {
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
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const contentType = request.headers.get('content-type') ?? ''

    const updateData: Record<string, unknown> = {}
    let nextImageFile: File | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()

      const categoryId = formData.get('category_id')
      const name = formData.get('name')
      const slug = formData.get('slug')
      const description = formData.get('description')
      const price = formData.get('price')
      const discountPrice = formData.get('discount_price')
      const material = formData.get('material')
      const isActive = formData.get('is_active')
      const originImage = formData.get('origin_image')

      if (typeof categoryId === 'string') updateData.category_id = categoryId
      if (typeof name === 'string') updateData.name = name
      if (typeof slug === 'string') updateData.slug = slug
      if (typeof description === 'string') updateData.description = description
      if (typeof material === 'string') updateData.material = material
      if (typeof isActive === 'string') updateData.is_active = isActive

      if (typeof price === 'string' && price.trim() !== '') {
        updateData.price = Number(price)
      }
      if (typeof discountPrice === 'string' && discountPrice.trim() !== '') {
        updateData.discount_price = Number(discountPrice)
      }

      if (originImage instanceof File && originImage.size > 0) {
        nextImageFile = originImage
      }
    } else {
      const body = await request.json()

      if (body.category_id !== undefined) updateData.category_id = body.category_id
      if (body.name !== undefined) updateData.name = body.name
      if (body.slug !== undefined) updateData.slug = body.slug
      if (body.description !== undefined) updateData.description = body.description
      if (body.price !== undefined) updateData.price = Number(body.price)
      if (body.discount_price !== undefined) updateData.discount_price = Number(body.discount_price)
      if (body.material !== undefined) updateData.material = body.material
      if (body.is_active !== undefined) updateData.is_active = body.is_active
    }

    if (nextImageFile) {
      const imageResult = await uploadImage(nextImageFile)
      if ('error' in imageResult) {
        return NextResponse.json(
          {
            data: null,
            error: imageResult.error,
            message: 'Failed to upload image',
            status: 500,
          },
          { status: 500 },
        )
      }
      updateData.origin_image = imageResult.url
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          data: null,
          error: 'No fields to update',
          message: 'No fields to update',
          status: 400,
        },
        { status: 400 },
      )
    }

    const { data, error } = await getSupabase()
      .from('product')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json(
        {
          data: null,
          error: error?.message ?? 'Product not found',
          message: 'Failed to update product',
          status: 400,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        data,
        error: null,
        message: 'Product updated successfully',
        status: 200,
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

