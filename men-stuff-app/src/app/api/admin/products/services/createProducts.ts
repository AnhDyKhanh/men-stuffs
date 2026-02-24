import { Product } from "@/app/_models/product";
import { Data } from "@/app/_types/response.type";
import { getSupabase } from "@/lib/supabase";

export type CreateProductDTO = {
  category_id: string
  name: string
  slug: string
  description: string
  price: number
  discount_price: number
  material: string
  is_active: 'active' | 'inactive'
}

export async function createProduct(body: CreateProductDTO): Promise<Data<Product>> {
  try {
    const {
      category_id,
      name,
      slug,
      description,
      price,
      discount_price,
      material,
      is_active,
    } = body

    if (!category_id || !name || !slug || !description || price == null || discount_price == null || !material || !is_active) {
      return {
        data: null,
        error: 'Missing required fields',
        message: null,
        status: 400
      }
    }

    if (price < 0 || discount_price < 0) {
      return {
        data: null,
        error: 'Invalid price',
        message: null,
        status: 400
      }
    }

    const { data, error } = await getSupabase()
      .from('product')
      .insert([{
        category_id,
        name,
        slug,
        description,
        price,
        discount_price,
        material,
        is_active
      }])
      .select()
      .single()

    if (error) {
      return {
        data: null,
        error: error.message,
        message: 'Failed to create product',
        status: 400
      }
    }

    return {
      data,
      error: null,
      message: 'Product created successfully',
      status: 201
    }

  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create product',
      message: null,
      status: 500
    }
  }
}