import { ProductQueryOptions } from "@/app/_dtos/get-product-list-option.dto";
import { Product } from "@/app/_models/product";
import { Data } from "@/app/_types/response.type";
import { getSupabase } from "@/lib/supabase";

export async function getAllProducts(
  options: ProductQueryOptions = {}
): Promise<Data<Product[]>> {

  const {
    page = 1, // Mặc định nên là 1
    size = 10,
    orderBy = 'created_at',
    ascending = false
  } = options;

  // Fix logic tính toán range chuẩn xác
  const safePage = Math.max(1, Number(page));
  const safeSize = Math.max(1, Number(size));
  const from = (safePage - 1) * safeSize;
  const to = from + safeSize - 1;

  try {
    const supabase = getSupabase();

    const { data, error, count } = await supabase
      .from('product')
      .select('*', { count: 'exact' })
      .order(orderBy, { ascending })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      error: null,
      message: `Fetched successfully. Total: ${count}`,
      status: 200
    };

  } catch (error: any) {
    console.error('[API GET /api/admin/products] exception:', error);
    return {
      data: null,
      error: error.message || 'Failed to fetch products',
      message: null,
      status: 500
    };
  }
}