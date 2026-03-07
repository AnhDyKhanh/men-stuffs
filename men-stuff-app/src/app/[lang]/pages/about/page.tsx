import Link from 'next/link'
import { BASE_PATH } from '@/lib/labels'

type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function AboutPage({ params }: PageProps) {
  await params

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Về chúng tôi</h1>
        <p className="text-lg text-neutral-400 mb-12">
          Chào mừng bạn đến với Men Stuffs — điểm đến uy tín cho thời trang nam.
        </p>

        {/* Our Story */}
        <section className="mb-16" aria-labelledby="our-story-heading">
          <h2
            id="our-story-heading"
            className="text-2xl font-semibold text-white mb-6 md:text-3xl"
          >
            Our Story
          </h2>
          <div className="space-y-6 text-neutral-300 leading-relaxed">
            <p>
              Men Stuffs ra đời từ niềm đam mê mang đến những trang phục chất lượng,
              phong cách cho nam giới hiện đại. Chúng tôi tin rằng thời trang không chỉ
              là vẻ bề ngoài mà còn là cách bạn thể hiện bản thân mỗi ngày.
            </p>
            <p>
              Từ những sản phẩm đầu tiên đến nay, chúng tôi không ngừng cải tiến chất
              liệu, kiểu dáng và trải nghiệm mua sắm. Mỗi mảnh trang phục đều được
              chọn lọc và thiết kế để phù hợp với cuộc sống năng động của bạn.
            </p>
            <p>
              Hành trình của chúng tôi gắn với sự tin tưởng của khách hàng — từ
              những bộ đồ công sở chỉn chu đến trang phục casual thoải mái, Men Stuffs
              luôn đồng hành cùng bạn trong mọi khoảnh khắc.
            </p>
          </div>
        </section>

        {/* Values / Highlights */}
        <section className="mb-16" aria-labelledby="values-heading">
          <h2
            id="values-heading"
            className="text-2xl font-semibold text-white mb-6 md:text-3xl"
          >
            Giá trị cốt lõi
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: 'Chất lượng',
                desc: 'Sản phẩm được kiểm tra kỹ, chất liệu bền đẹp và phù hợp sử dụng lâu dài.',
              },
              {
                title: 'Phong cách',
                desc: 'Thiết kế hiện đại, dễ phối đồ, phù hợp nhiều hoàn cảnh và lứa tuổi.',
              },
              {
                title: 'Trải nghiệm',
                desc: 'Mua sắm dễ dàng, giao hàng nhanh và chính sách đổi trả rõ ràng.',
              },
              {
                title: 'Khách hàng',
                desc: 'Lắng nghe phản hồi và không ngừng cải thiện để phục vụ bạn tốt hơn.',
              },
            ].map((item) => (
              <li
                key={item.title}
                className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800"
              >
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-400">{item.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="pt-8 border-t border-neutral-800">
          <p className="text-neutral-400 mb-4">
            Bạn có câu hỏi hoặc cần tư vấn? Hãy liên hệ với chúng tôi.
          </p>
          <Link
            href={`${BASE_PATH}/pages/contact`}
            className="inline-block px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
          >
            Liên hệ
          </Link>
        </div>
      </div>
    </div>
  )
}
