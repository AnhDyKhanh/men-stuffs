type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function DeliveryPolicyPage({ params }: PageProps) {
  await params

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Chính sách giao hàng</h1>
      <div className="max-w-3xl space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Thông tin giao hàng</h2>
          <p className="text-gray-600">
            Chúng tôi giao hàng nhanh chóng và đáng tin cậy trên toàn quốc. Giao hàng tiêu chuẩn 3–5 ngày làm việc, giao hàng nhanh 1–2 ngày làm việc.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Miễn phí giao hàng</h2>
          <p className="text-gray-600">
            Đơn hàng từ 1.000.000₫ trở lên được miễn phí giao hàng. Các đơn khác tính phí theo bảng giá.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Đổi trả</h2>
          <p className="text-gray-600">
            Chấp nhận đổi trả trong vòng 30 ngày kể từ ngày mua. Sản phẩm phải còn nguyên tem mác, điều kiện như ban đầu.
          </p>
        </section>
      </div>
    </div>
  )
}
