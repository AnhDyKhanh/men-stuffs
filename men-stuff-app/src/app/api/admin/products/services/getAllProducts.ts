import { getSupabase } from "@/lib/supabase";

export async function getAllProducts() {
  try {
    const { data } = await getSupabase()
      .from('product')
      .select('*')
    if (data) {
      return data
    }
    return { error: 'No products found' }

  } catch (error) {
    console.error('[API GET /api/admin/products] exception:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch products' }
  }
}