import { ProductQueryOptions } from "@/app/_dtos/get-product-list-option.dto";
import { Product } from "@/app/_models/product";
import { Data } from "@/app/_types/response.type";
import { getSupabase } from "@/lib/supabase";

export async function getAllProducts(
  options: ProductQueryOptions = {}
): Promise<Data<Product[]>> {

  const {
    page = 0,
    size = 10,
    orderBy = 'created_at',
    ascending = false
  } = options;

  const from = page * size;
  const to = from + size - 1;

  try {
    const { data, error, count } = await getSupabase()
      .from('product')
      .select('*', { count: 'exact' })
      .order(orderBy, { ascending: ascending })
      .range(from, to);

    if (error) throw error;

    if (data) {
      return {
        data: data,
        error: null,
        message: `Products fetched successfully. Total: ${count}`,
        status: 200
      };
    }

    return { data: null, error: 'No products found', message: null, status: 404 };

  } catch (error) {
    console.error('[API GET /api/admin/products] exception:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
      message: null,
      status: 500
    };
  }
}