import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';

/**
 * Home page - storefront landing page
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">{t('home.title')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('home.subtitle')}</p>
        <Link
          href={`/${locale}/products`}
          className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          {t('home.shopNow')}
        </Link>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-8">{t('products.allProducts')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example product cards - replace with real data */}
          {[1, 2, 3].map((id) => (
            <div key={id} className="border rounded-lg p-6 hover:shadow-lg transition">
              <div className="bg-gray-200 h-48 rounded mb-4"></div>
              <h3 className="font-semibold text-lg mb-2">Product {id}</h3>
              <p className="text-gray-600 mb-4">Product description goes here</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">$99.99</span>
                <Link
                  href={`/${locale}/products/product-${id}`}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

