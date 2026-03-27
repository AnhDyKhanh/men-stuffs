'use client'
import ProductsTable from '@/app/(admin)/products-management/_components/ProductsTable'
import CreateProductDialog from '@/app/(admin)/products-management/_components/CreateProductDialog'
import { Button } from '@/components/ui/button'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import { BASE_PATH } from '@/lib/labels'
import { useState } from 'react'

export default function AdminProductsPage() {
  const productsQuery = useGetAllProducts({
    page: 0,
    size: 100,
    orderBy: 'created_at',
    ascending: false,
    status: 'active',
  })
  const { data: productsData, refetch } = productsQuery
  const products = productsData?.data ?? []
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
        <Button onClick={() => setCreateOpen(true)} className="bg-primary text-primary-foreground hover:opacity-90">
          Tạo sản phẩm mới
        </Button>
      </div>

      <ProductsTable products={products} locale="vi" createProductHref={`${BASE_PATH}/products-management/new`} />

      <CreateProductDialog
        open={createOpen}
        onOpenChangeAction={setCreateOpen}
        onCreatedAction={() => void refetch()}
      />
    </div>
  )
}
