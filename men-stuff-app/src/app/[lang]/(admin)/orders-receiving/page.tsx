import OrdersReceivingClient from './_components/OrdersReceivingClient'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function OrdersReceivingPage({ params }: PageProps) {
  await params

  return <OrdersReceivingClient />
}

