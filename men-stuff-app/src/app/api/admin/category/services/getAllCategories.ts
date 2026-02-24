import { getSupabase } from "@/lib/supabase"

export async function getAllCategories() {
  try {
    const { data } = await getSupabase()
      .from('category')
      .select('*')
    if (data) {
      return data || []
    }
    return { error: 'No categories found' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to fetch categories' }
  }
}