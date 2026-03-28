import { getSupabaseAdmin } from '@/lib/supabase'
import type { Product } from '@/models/product'

import type { CollectionRow, CollectionWithProducts } from '@/app/api/admin/collections/services/getCollectionsList'

/**
 * POST /api/admin/collections — toàn bộ logic tạo collection + gán sản phẩm (collection_item).
 * Tách hàm nhỏ chỉ trong file này.
 */

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

async function insertCollectionRow(body: { name: string; description?: string | null }): Promise<CollectionRow> {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('collection')
    .insert({ name: body.name.trim(), description: body.description?.trim() || null })
    .select('id, name, description, created_at')
    .single()
  if (error) throw error
  return data as CollectionRow
}

/**
 * Thay thế toàn bộ item của một collection.
 * Chỉ ghi `collection_id` + `product_id` (khớp model CollectionItem — không dùng sort_order).
 */
export async function replaceCollectionItems(collectionId: string, productIds: string[]): Promise<void> {
  const admin = getSupabaseAdmin()
  const { error: dErr } = await admin.from('collection_item').delete().eq('collection_id', collectionId)
  if (dErr) throw dErr
  if (productIds.length === 0) return
  const rows = productIds.map((product_id) => ({
    collection_id: collectionId,
    product_id,
  }))
  const { error: iErr } = await admin.from('collection_item').insert(rows)
  if (iErr) throw iErr
}

async function fetchCollectionWithProductsById(id: string): Promise<CollectionWithProducts | null> {
  const admin = getSupabaseAdmin()
  const { data: c, error: e1 } = await admin
    .from('collection')
    .select('id, name, description, created_at')
    .eq('id', id)
    .maybeSingle()

  if (e1) throw e1
  if (!c) return null

  const { data: items, error: e2 } = await admin
    .from('collection_item')
    .select('id, collection_id, product_id')
    .eq('collection_id', id)
    .order('id', { ascending: true })

  if (e2) throw e2

  const productIds = [...new Set((items ?? []).map((r: { product_id: string }) => r.product_id))]
  let products: Product[] = []
  if (productIds.length > 0) {
    const { data: prods, error: e3 } = await admin.from('product').select('*').in('id', productIds)
    if (e3) throw e3
    const productById = new Map<string, Product>()
    for (const raw of prods ?? []) {
      const p = mapProduct(raw as Record<string, unknown>)
      productById.set(p.id, p)
    }
    products = (items ?? [])
      .map((row: { product_id: string }) => productById.get(row.product_id))
      .filter((p): p is Product => p != null)
  }

  return { ...(c as CollectionRow), products }
}

export type CreateCollectionWithItemsInput = {
  name: string
  description?: string | null
  productIds?: string[]
}

/**
 * Tạo một dòng `collection`, sau đó (tuỳ chọn) ghi `collection_item` theo `productIds`.
 */
export async function createCollectionWithItems(input: CreateCollectionWithItemsInput): Promise<CollectionWithProducts> {
  const name = input.name?.trim()
  if (!name) {
    throw new Error('name is required')
  }

  const productIds = Array.isArray(input.productIds)
    ? input.productIds.map((id) => String(id).trim()).filter(Boolean)
    : []

  const row = await insertCollectionRow({
    name,
    description: input.description,
  })

  if (productIds.length > 0) {
    await replaceCollectionItems(row.id, productIds)
  }

  const full = await fetchCollectionWithProductsById(row.id)
  if (!full) {
    return { ...row, products: [] }
  }
  return full
}
