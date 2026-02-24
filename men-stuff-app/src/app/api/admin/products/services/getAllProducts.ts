import { Product } from "@/app/_models/product";
import { Data } from "@/app/_types/response.type";
import { getSupabase } from "@/lib/supabase";

export async function getAllProducts(): Promise<Data<Product[]>> {
  try {
    const { data } = await getSupabase()
      .from('product')
      .select('*')
    if (data) {
      return { data: data, error: null, message: 'Products fetched successfully', status: 200 }
    }
    return { data: null, error: 'No products found', message: null, status: 404 }

  } catch (error) {
    console.error('[API GET /api/admin/products] exception:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch products', message: null, status: 500 }
  }
}