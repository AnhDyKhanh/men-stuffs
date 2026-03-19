import { Data } from '@/app/_types/response.type'
import { getSupabase } from '@/lib/supabase'

type GetProductByIdParams = {
  id: string
}

export type GetProductByIdData = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  thumbnail: string
  status: string
  createdAt: string
}

export type GetProductByIdResponse = Data<GetProductByIdData>

export async function getProductById(params: GetProductByIdParams): Promise<GetProductByIdResponse> {
  try {
    const { id } = params
    const supabase = getSupabase()

    const { data } = await supabase.from('product').select('*').eq('id', id).maybeSingle()

    if (!data) return {
      data: null,
      error: 'Product not found',
      message: 'Product not found',
      status: 404,
    }

    const product = {
      id: data.id,
      name: data.name ?? '',
      slug: data.slug ?? '',
      description: data.description ?? '',
      price: Number(data.price),
      thumbnail: data.origin_image ?? '',
      status: data.status ?? 'active',
      createdAt: data.created_at ?? new Date().toISOString(),
    }

    return {
      data: product,
      error: null,
      message: 'Product fetched successfully',
      status: 200,
    }

  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch product',
      message: 'Failed to fetch product',
      status: 500,
    }
  }
}

export async function deleteProductById(params: GetProductByIdParams) {
  const { id } = params
  const { statusText } = await getSupabase().from('product').delete().eq('id', id)

  return { statusText }
}
