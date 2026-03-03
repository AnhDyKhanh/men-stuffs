import ProductsTable from '@/app/[lang]/(admin)/dashboard/_components/ProductsTable'
import { getAllProducts } from '@/app/api/admin/products/services/getAllProducts'
import type { Product } from '@/app/_types/product'
import { labels, BASE_PATH } from '@/lib/labels'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function AdminProductsPage({ params }: PageProps) {
  await params
  const res = await getAllProducts({ page: 0, size: 100, orderBy: 'created_at', ascending: false })
  const raw = res?.data ?? []
  const products: Product[] = raw.map((p: { id: string; is_active?: string | null; [key: string]: unknown }) => ({
    ...p,
    status: (p.is_active === 'inactive' ? 'inactive' : 'active') as Product['status'],
  })) as Product[]
  const error = res?.error ? String(res.error) : null
  const dict = labels.admin

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-black font-bold tracking-tight">{dict.products}</h1>
        <Button asChild>
          <Link href={`${BASE_PATH}/products-management/new`}>
            {dict.createProduct}
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-3 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      <ProductsTable
        variant="white"
        products={products}
        locale="vi"
        dict={{
          productName: dict.productName,
          productPrice: dict.productPrice,
          status: dict.status,
          createdAt: dict.createdAt,
          actions: dict.actions,
          active: dict.active,
          inactive: dict.inactive,
          editProduct: dict.editProduct,
          noProducts: dict.noProducts,
          createProduct: dict.createProduct,
          prev: dict.prev,
          next: dict.next,
          pageOf: dict.pageOf,
          rowsPerPage: dict.rowsPerPage,
        }}
        createProductHref={`${BASE_PATH}/products-management/new`}
      />
    </div>
  )
}
