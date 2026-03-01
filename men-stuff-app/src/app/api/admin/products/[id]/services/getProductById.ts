import { getSupabase } from '@/lib/supabase';

//ở đây khai báo param cho serivce này
type GetProductByIdParams = {
  id: string
}

export async function getProductById(params: GetProductByIdParams) {
  try {
    const { id } = params
    const supabase = getSupabase()

    const { data } = await supabase
      .from('product')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!data) return undefined

    // Lấy ảnh primary từ product_image (product_id trùng, is_primary = true)
    const { data: primaryImage } = await supabase
      .from('product_image')
      .select('image_url')
      .eq('product_id', id)
      .eq('is_primary', true)
      .maybeSingle()

    const thumbnail =
      primaryImage?.image_url ?? ''

    const product = {
      id: data.id,
      name: data.name ?? '',
      slug: data.slug ?? '',
      description: data.description ?? '',
      price: Number(data.price),
      thumbnail,
      status: data.status ?? 'active',
      createdAt:
        data.created_at ?? data.createdAt ?? new Date().toISOString(),
    }
    return product
  } catch (err) {
    console.error('[API GET /api/admin/products/:id] exception:', err)
    return { error: err instanceof Error ? err.message : 'Failed to fetch product' }
  }
}

export async function deleteProductById(params: GetProductByIdParams) {
  const { id } = params;
  const { statusText } = await getSupabase()
    .from('product')
    .delete()
    .eq('id', id)

  return { statusText }
}
