import NewInClient from './_components/NewInClient'

type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function NewInPage({ params }: PageProps) {
  await params
  return <NewInClient />
}
