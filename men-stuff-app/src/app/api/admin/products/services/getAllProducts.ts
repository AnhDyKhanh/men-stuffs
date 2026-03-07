import { ProductQueryOptions } from "@/app/_dtos/get-product-list-option.dto";
import { Product } from "@/app/_models/product";
import { PaginatedData } from "@/app/_types/response.type";
import { getSupabase } from "@/lib/supabase";

export async function getAllProducts(
  options: ProductQueryOptions = {}
): Promise<PaginatedData<Product[]>> {

  const {
    page = 0,
    size = 10,
    orderBy = 'created_at',
    ascending = false,
    categoryId,
    search,
  } = options;

  const pageIndex = Math.max(0, Number(page));
  const safeSize = Math.max(1, Math.min(100, Number(size)));
  const from = pageIndex * safeSize;
  const to = from + safeSize - 1;

  try {
    const supabase = getSupabase();

    let query = supabase
      .from('product')
      .select('*', { count: 'exact' });

    if (categoryId && String(categoryId).trim()) {
      query = query.eq('category_id', String(categoryId).trim());
    }

    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`;
      query = query.ilike('name', term);
    }

    const { data, error, count } = await query
      .order(orderBy, { ascending })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count ?? 0,
      error: null,
      message: null,
      status: 200
    };

  } catch (error: unknown) {
    console.error('[API GET /api/admin/products] exception:', error);
    return {
      data: null,
      total: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
      message: null,
      status: 500
    };
  }
}