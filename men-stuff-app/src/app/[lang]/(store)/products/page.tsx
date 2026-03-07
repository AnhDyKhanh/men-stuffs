import ShopAllClient from './_components/ShopAllClient'

type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function ProductsPage({ params }: PageProps) {
  await params
  return <ShopAllClient />
}
