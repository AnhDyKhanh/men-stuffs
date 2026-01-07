import { useTranslations } from '@/lib/i18n';

/**
 * Contact page
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="max-w-2xl">
        <form className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              className="w-full border rounded px-4 py-2"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded px-4 py-2"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Message</label>
            <textarea
              rows={6}
              className="w-full border rounded px-4 py-2"
              placeholder="Your message"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

