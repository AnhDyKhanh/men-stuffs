import { getSupabaseAdmin } from '@/lib/supabase'
import type { Product } from '@/models/product'

export type CollectionRow = {
  id: string
  name: string
  description: string | null
  created_at: string
}

export type CollectionWithProducts = CollectionRow & {
  products: Product[]
}

function mapProduct(raw: Record<string, unknown>): Product {
  return {
    id: String(raw.id ?? ''),
    category_id: (raw.category_id as string | null) ?? null,
    name: (raw.name as string | null) ?? null,
    slug: (raw.slug as string | null) ?? null,
    description: (raw.description as string | null) ?? null,
    price: (raw.price as number | null) ?? null,
    discount_price: (raw.discount_price as number | null) ?? null,
    material: (raw.material as string | null) ?? null,
    is_active: (raw.is_active as Product['is_active']) ?? null,
    created_at: (raw.created_at as Date | null) ?? null,
    updated_at: (raw.updated_at as Date | null) ?? null,
    origin_image: (raw.origin_image as string | null) ?? null,
  }
}

/**
 * Danh sách tất cả collection, mỗi phần tử kèm `products`.
 * `collection_item` chỉ có id + collection_id + product_id — thứ tự hiển thị ổn định theo `id` dòng item.
 * (Nếu cần đúng thứ tự user chọn, thêm cột `sort_order` trong DB và map lại.)
 */
export async function getCollectionsList(): Promise<CollectionWithProducts[]> {
  const admin = getSupabaseAdmin()
  const { data: collections, error: e1 } = await admin
    .from('collection')
    .select('id, name, description, created_at')
    .order('created_at', { ascending: false })

  if (e1) throw e1
  if (!collections?.length) return []

  const ids = collections.map((c: { id: string }) => c.id)
  const { data: items, error: e2 } = await admin
    .from('collection_item')
    .select('id, collection_id, product_id')
    .in('collection_id', ids)
    .order('id', { ascending: true })

  if (e2) throw e2

  const productIds = [...new Set((items ?? []).map((r: { product_id: string }) => r.product_id))]
  const productById = new Map<string, Product>()
  if (productIds.length > 0) {
    const { data: prods, error: e3 } = await admin.from('product').select('*').in('id', productIds)
    if (e3) throw e3
    for (const raw of prods ?? []) {
      const p = mapProduct(raw as Record<string, unknown>)
      productById.set(p.id, p)
    }
  }

  const byColl = new Map<string, Product[]>()
  for (const row of items ?? []) {
    const r = row as { collection_id: string; product_id: string }
    const p = productById.get(r.product_id)
    if (!p) continue
    const list = byColl.get(r.collection_id) ?? []
    list.push(p)
    byColl.set(r.collection_id, list)
  }

  return (collections as CollectionRow[]).map((c) => ({
    ...c,
    products: byColl.get(c.id) ?? [],
  }))
}
