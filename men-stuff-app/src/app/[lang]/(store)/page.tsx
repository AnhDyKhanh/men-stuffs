import StoreHomeClient from './_components/StoreHomeClient'

type PageProps = {
  params: { lang: string }
}

export default function HomePage({ params }: PageProps) {
  void params
  return (
    <StoreHomeClient />
  )
}
