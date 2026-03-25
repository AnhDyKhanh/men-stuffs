'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { BASE_PATH, labels } from '@/lib/labels'
import { API_ROUTES } from '@/constants/apiRouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import type { Product } from '@/models/product'

type CollectionWithProducts = {
  id: string
  name: string
  description: string | null
  created_at: string
  products: Product[]
}

async function fetchAdminCollections(): Promise<CollectionWithProducts[]> {
  const res = await fetch(API_ROUTES.COLLECTIONS.ADMIN, { credentials: 'include', cache: 'no-store' })
  const json = (await res.json()) as { data?: CollectionWithProducts[]; error?: string }
  if (!res.ok) throw new Error(json.error || 'Không tải được danh sách')
  return json.data ?? []
}

export default function CollectionsManagementClient() {
  const dict = labels.admin
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pickedIds, setPickedIds] = useState<string[]>([])

  const { data: collections = [], isLoading, error, isError } = useQuery({
    queryKey: ['@admin-collections'],
    queryFn: fetchAdminCollections,
  })

  const { data: productsRes } = useGetAllProducts({
    page: 1,
    size: 200,
    orderBy: 'created_at',
    ascending: false,
  })
  const allProducts = (productsRes?.data ?? []) as Product[]

  const activeCollection = useMemo(
    () => collections.find((c) => c.id === selectedId) ?? null,
    [collections, selectedId],
  )

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(API_ROUTES.COLLECTIONS.ADMIN, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: description || null }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Tạo thất bại')
      return json.data as CollectionWithProducts
    },
    onSuccess: () => {
      setName('')
      setDescription('')
      void qc.invalidateQueries({ queryKey: ['@admin-collections'] })
    },
  })

  const patchMutation = useMutation({
    mutationFn: async (payload: { id: string; name: string; description: string | null }) => {
      const res = await fetch(API_ROUTES.COLLECTIONS.ADMIN_ONE(payload.id), {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: payload.name, description: payload.description }),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || 'Cập nhật thất bại')
      }
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['@admin-collections'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(API_ROUTES.COLLECTIONS.ADMIN_ONE(id), { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error('Xóa thất bại')
    },
    onSuccess: () => {
      setSelectedId(null)
      void qc.invalidateQueries({ queryKey: ['@admin-collections'] })
    },
  })

  const saveItemsMutation = useMutation({
    mutationFn: async (payload: { collectionId: string; productIds: string[] }) => {
      const res = await fetch(API_ROUTES.COLLECTIONS.ADMIN_ITEMS(payload.collectionId), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: payload.productIds }),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || 'Lưu sản phẩm thất bại')
      }
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['@admin-collections'] }),
  })

  const openEditor = useCallback((c: CollectionWithProducts) => {
    setSelectedId(c.id)
    setPickedIds(c.products.map((p) => p.id))
  }, [])

  const toggleProduct = useCallback((id: string) => {
    setPickedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">{dict.collectionsManagement}</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">{dict.collectionsHint}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`${BASE_PATH}/collections`} target="_blank" rel="noreferrer">
            Xem trang Bộ sưu tập
          </Link>
        </Button>
      </div>

      {isError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-3 text-sm text-destructive">
            {(error as Error)?.message || 'Lỗi tải dữ liệu'}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{dict.createCollection}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[200px] flex-1 space-y-1">
            <label className="text-xs font-medium text-gray-600">{dict.collectionName}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Black Silver" />
          </div>
          <div className="min-w-[200px] flex-[2] space-y-1">
            <label className="text-xs font-medium text-gray-600">{dict.collectionDescription}</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn hiển thị trên storefront"
            />
          </div>
          <Button
            type="button"
            disabled={!name.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {dict.createCollection}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh sách</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-gray-500">Đang tải…</p>}
          {!isLoading && collections.length === 0 && (
            <p className="text-sm text-gray-600">Chưa có bộ sưu tập nào. Tạo ở trên hoặc kiểm tra đã chạy SQL chưa.</p>
          )}
          <ul className="divide-y rounded-lg border">
            {collections.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500">
                    {c.products.length} sản phẩm ·{' '}
                    {c.description ? c.description.slice(0, 80) + (c.description.length > 80 ? '…' : '') : '—'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEditor(c)}>
                    {dict.collectionProducts}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Xóa bộ “${c.name}”?`)) deleteMutation.mutate(c.id)
                    }}
                  >
                    Xóa bộ
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {activeCollection && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-lg">Chỉnh sửa: {activeCollection.name}</CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
              Đóng
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-gray-600">{dict.collectionName}</label>
                <Input
                  id={`edit-name-${activeCollection.id}`}
                  defaultValue={activeCollection.name}
                  key={activeCollection.id + '-n'}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">{dict.collectionDescription}</label>
                <Input
                  id={`edit-desc-${activeCollection.id}`}
                  defaultValue={activeCollection.description ?? ''}
                  key={activeCollection.id + '-d'}
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const nEl = document.getElementById(`edit-name-${activeCollection.id}`) as HTMLInputElement | null
                const dEl = document.getElementById(`edit-desc-${activeCollection.id}`) as HTMLInputElement | null
                patchMutation.mutate({
                  id: activeCollection.id,
                  name: nEl?.value?.trim() || activeCollection.name,
                  description: dEl?.value?.trim() || null,
                })
              }}
              disabled={patchMutation.isPending}
            >
              {dict.save}
            </Button>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-800">{dict.collectionProducts}</p>
              <p className="mb-2 text-xs text-gray-500">Chọn sản phẩm (thứ tự = thứ tự bạn chọn lần lượt). Bấm lại để bỏ.</p>
              <div className="max-h-60 overflow-y-auto rounded border bg-white p-2">
                <ul className="grid gap-1 sm:grid-cols-2">
                  {allProducts.map((p) => (
                    <li key={p.id}>
                      <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={pickedIds.includes(p.id)}
                          onChange={() => toggleProduct(p.id)}
                        />
                        <span className="truncate">{p.name}</span>
                        <span className="shrink-0 text-xs text-gray-500">{p.price?.toLocaleString('vi-VN')}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() =>
                    saveItemsMutation.mutate({ collectionId: activeCollection.id, productIds: pickedIds })
                  }
                  disabled={saveItemsMutation.isPending}
                >
                  {dict.saveProducts}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setPickedIds(activeCollection.products.map((p) => p.id))}>
                  Khôi phục từ server
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
