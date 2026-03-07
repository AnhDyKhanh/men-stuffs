import Link from 'next/link'
import { BASE_PATH } from '@/lib/labels'

type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function AboutPage({ params }: PageProps) {
  await params

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-4 py-12 pb-20">
        <Link
          href={BASE_PATH}
          className="mb-10 inline-block text-sm text-neutral-400 hover:text-white"
        >
          ← Về trang chủ
        </Link>

        <header className="mb-14">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Về chúng tôi
          </h1>
          <p className="mt-3 text-lg text-neutral-400">
            Men Stuffs — điểm đến tin cậy cho thời trang nam
          </p>
        </header>

        <section className="space-y-10" aria-labelledby="our-story-heading">
          <h2
            id="our-story-heading"
            className="text-2xl font-bold text-white"
          >
            Our story
          </h2>

          <div className="space-y-6 text-neutral-300">
            <p className="text-base leading-relaxed">
              Men Stuffs ra đời từ niềm đam mê mang đến cho nam giới những sản phẩm thời trang
              chất lượng, thiết kế tinh gọn và dễ phối đồ. Chúng tôi tin rằng phong cách không
              chỉ là vẻ bề ngoài mà còn là sự tự tin và thoải mái mỗi ngày.
            </p>
            <p className="text-base leading-relaxed">
              Từ những món căn bản như áo thun, quần jeans đến các item cao cấp hơn, mỗi sản phẩm
              đều được chọn lọc kỹ về chất liệu và kiểu dáng, phù hợp với nhiều phong cách sống
              và công việc. Chúng tôi không ngừng cập nhật bộ sưu tập mới để bạn luôn có lựa chọn
              phù hợp với xu hướng và nhu cầu cá nhân.
            </p>
          </div>

          <div className="border-t border-neutral-800 pt-10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Sứ mệnh
            </h3>
            <p className="text-neutral-400 leading-relaxed">
              Mang đến trải nghiệm mua sắm trực tuyến thuận tiện, minh bạch và đáng tin cậy.
              Mọi khách hàng đều xứng đáng có được sản phẩm ưng ý và dịch vụ chăm sóc tận tâm.
            </p>
          </div>

          <div className="border-t border-neutral-800 pt-10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Giá trị cốt lõi
            </h3>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex gap-3">
                <span className="text-white font-medium min-w-[1.5rem]">·</span>
                <span>Chất lượng sản phẩm và dịch vụ luôn đặt lên hàng đầu.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white font-medium min-w-[1.5rem]">·</span>
                <span>Minh bạch trong giao dịch và chính sách đổi trả rõ ràng.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white font-medium min-w-[1.5rem]">·</span>
                <span>Lắng nghe phản hồi để không ngừng cải thiện trải nghiệm khách hàng.</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-neutral-800 pt-10">
            <p className="text-neutral-500 text-sm">
              Cảm ơn bạn đã tin tưởng và đồng hành cùng Men Stuffs. Nếu có bất kỳ câu hỏi hay
              góp ý nào, hãy liên hệ với chúng tôi qua trang Liên hệ & Phản hồi.
            </p>
            <Link
              href={`${BASE_PATH}/pages/contact`}
              className="mt-4 inline-block rounded-lg border border-neutral-600 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Liên hệ & Phản hồi
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
