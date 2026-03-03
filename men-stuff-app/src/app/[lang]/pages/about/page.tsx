type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function AboutPage({ params }: PageProps) {
  await params

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Về chúng tôi</h1>
      <div className="max-w-3xl">
        <p className="text-lg text-gray-600 mb-4">
          Chào mừng bạn đến với Men Stuffs, điểm đến uy tín cho các sản phẩm thời trang nam.
        </p>
        <p className="text-lg text-gray-600">
          Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với đa dạng sản phẩm và dịch vụ khách hàng tận tâm.
        </p>
      </div>
    </div>
  )
}
