import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';

/**
 * Products listing page
 */
export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');

  // Mock products data - replace with real data fetching
  const products = [
    { id: 1, name: 'Product 1', slug: 'product-1', price: 99.99, description: 'Description 1' },
    { id: 2, name: 'Product 2', slug: 'product-2', price: 149.99, description: 'Description 2' },
    { id: 3, name: 'Product 3', slug: 'product-3', price: 199.99, description: 'Description 3' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('products.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-6 hover:shadow-lg transition">
            <div className="bg-gray-200 h-48 rounded mb-4"></div>
            <h2 className="font-semibold text-xl mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${product.price}</span>
              <div className="flex gap-2">
                <Link
                  href={`/${locale}/product/${product.slug}`}
                  className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
                >
                  View
                </Link>
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                  {t('products.addToCart')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

