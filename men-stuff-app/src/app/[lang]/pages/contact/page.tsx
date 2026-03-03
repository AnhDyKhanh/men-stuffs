type PageProps = {
  params: Promise<{ lang: string }>
}

export default async function ContactPage({ params }: PageProps) {
  await params

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Liên hệ</h1>
      <div className="max-w-2xl">
        <form className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Họ tên</label>
            <input
              type="text"
              className="w-full border rounded px-4 py-2"
              placeholder="Nhập họ tên"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded px-4 py-2"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Nội dung</label>
            <textarea
              rows={6}
              className="w-full border rounded px-4 py-2"
              placeholder="Nhập nội dung"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Gửi tin nhắn
          </button>
        </form>
      </div>
    </div>
  )
}
