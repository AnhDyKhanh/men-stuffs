import { Product } from '@/models/product'
import { Data } from '@/types/response.type'
import { getSupabase } from '@/lib/supabase'
import { uploadImage } from '@/app/api/services/uploadImage'

export type CreateProductDTO = {
  category_id: string
  name: string
  slug: string
  description: string
  price: number
  discount_price: number
  material: string
  is_active: 'active' | 'inactive'
  origin_image: File
}

export async function createProduct(body: CreateProductDTO): Promise<Data<Product>> {
  try {
    const { category_id, name, slug, description, price, discount_price, material, is_active, origin_image } = body

    const imageResult = await uploadImage(origin_image)
    if ('error' in imageResult) return {
      data: null,
      error: imageResult.error,
      message: 'Failed to upload image',
      status: 500,
    }

    const { data, error } = await getSupabase()
      .from('product')
      .insert([
        {
          category_id,
          name,
          slug,
          description,
          price,
          discount_price,
          material,
          is_active,
          origin_image: imageResult,
        },
      ])
      .select()
      .single()

    if (error) {
      return {
        data: null,
        error: error.message,
        message: 'Failed to create product',
        status: 400,
      }
    }

    return {
      data,
      error: null,
      message: 'Product created successfully',
      status: 201,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create product',
      message: null,
      status: 500,
    }
  }
}
