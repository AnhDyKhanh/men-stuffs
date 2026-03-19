/**
 * Category entity (table: category)
 */
export type Category = {
  id: string
  name: string | null
  slug: string | null
  description: string | null
  is_active: boolean | null
  created_at: Date | null
}
