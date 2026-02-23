import { getSupabase } from '@/lib/supabase';

//ở đây khai báo param cho serivce này
type GetProductByIdParams = {
  id: string
}

export async function getProductById(params: GetProductByIdParams) {
  try {
    const { id } = params;
    //xử lý error sau đi
    const { data } = await getSupabase()
      .from('product')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (data) {
      const product = {
        id: data.id,
        name_vi: data.name_vi ?? '',
        name_en: data.name_en ?? '',
        price: Number(data.price),
        thumbnail: data.thumbnail ?? '',
        status: data.status ?? 'active',
        createdAt:
          data.created_at ?? data.createdAt ?? new Date().toISOString(),
      }
      return product
    }
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
