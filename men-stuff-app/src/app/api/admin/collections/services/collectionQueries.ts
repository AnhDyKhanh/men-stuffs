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

export async function listCollectionsWithProducts(): Promise<CollectionWithProducts[]> {
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
    .select('collection_id, sort_order, product_id')
    .in('collection_id', ids)
    .order('sort_order', { ascending: true })

  if (e2) throw e2

  const productIds = [...new Set((items ?? []).map((r: { product_id: string }) => r.product_id))]
  let productById = new Map<string, Product>()
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

export async function insertCollection(body: { name: string; description?: string | null }): Promise<CollectionRow> {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('collection')
    .insert({ name: body.name.trim(), description: body.description?.trim() || null })
    .select('id, name, description, created_at')
    .single()
  if (error) throw error
  return data as CollectionRow
}

export async function updateCollection(
  id: string,
  body: { name?: string; description?: string | null },
): Promise<void> {
  const admin = getSupabaseAdmin()
  const patch: Record<string, string | null> = {}
  if (body.name !== undefined) patch.name = body.name.trim()
  if (body.description !== undefined) patch.description = body.description?.trim() || null
  const { error } = await admin.from('collection').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteCollection(id: string): Promise<void> {
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('collection').delete().eq('id', id)
  if (error) throw error
}

export async function replaceCollectionItems(collectionId: string, productIds: string[]): Promise<void> {
  const admin = getSupabaseAdmin()
  const { error: dErr } = await admin.from('collection_item').delete().eq('collection_id', collectionId)
  if (dErr) throw dErr
  if (productIds.length === 0) return
  const rows = productIds.map((product_id, sort_order) => ({
    collection_id: collectionId,
    product_id,
    sort_order,
  }))
  const { error: iErr } = await admin.from('collection_item').insert(rows)
  if (iErr) throw iErr
}

export function isMissingTableError(err: unknown): boolean {
  const code = (err as { code?: string })?.code
  if (code === '42P01' || code === 'PGRST205') return true
  const msg = err instanceof Error ? err.message : String(err)
  return /does not exist|Could not find the table|relation/i.test(msg)
}
