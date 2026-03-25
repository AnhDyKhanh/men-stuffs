'use client'

import ProductsTable from '@/app/(admin)/dashboard/_components/ProductsTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetAllProducts } from '@/hooks/getAllProductsMutation'
import { BASE_PATH } from '@/lib/labels'
import Link from 'next/link'

export default function AdminProductsPage() {
  const { data: productsData } = useGetAllProducts({
    page: 0,
    size: 100,
    orderBy: 'created_at',
    ascending: false
  })
  const products = productsData?.data ?? []
  const error = productsData?.error ? String(productsData.error) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-black">Quản lý sản phẩm</h1>
        <Button asChild>
          <Link href={`${BASE_PATH}/products-management/new`}>Tạo sản phẩm mới</Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="text-destructive py-3 text-sm">{error}</CardContent>
        </Card>
      )}

      <ProductsTable
        variant="white"
        products={products}
        locale="vi"
        createProductHref={`${BASE_PATH}/products-management/new`}
      />
    </div>
  )
}
