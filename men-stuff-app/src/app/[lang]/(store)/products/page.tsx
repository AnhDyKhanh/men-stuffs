import ProductsPageClient from './_components/ProductsPageClient'

type PageProps = {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ view?: string; page?: string; category?: string; q?: string }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolved = await searchParams
  const view = resolved.view === 'new-in' ? 'new-in' : 'shop-all'
  const initialPage = Math.max(0, parseInt(resolved.page ?? '0', 10) || 0)
  const initialCategory = resolved.category?.trim() || undefined
  const initialSearch = (resolved.q ?? resolved.search)?.trim() || undefined

  return (
    <ProductsPageClient
      view={view}
      initialPage={Number.isNaN(initialPage) ? 0 : initialPage}
      initialCategoryId={initialCategory}
      initialSearch={initialSearch}
    />
  )
}
