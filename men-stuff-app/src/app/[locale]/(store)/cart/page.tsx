import { useTranslations } from '@/lib/i18n';
import Link from 'next/link';

/**
 * Shopping cart page
 */
export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');

  // Mock cart items - replace with real data
  const cartItems: any[] = [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('common.cart')}</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            href={`/${locale}/products`}
            className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          {/* Cart items list */}
          <div className="mb-8">
            {/* Render cart items here */}
          </div>
          
          {/* Cart summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-xl font-bold">$0.00</span>
            </div>
            <Link
              href={`/${locale}/checkout`}
              className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800"
            >
              {t('common.checkout')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

