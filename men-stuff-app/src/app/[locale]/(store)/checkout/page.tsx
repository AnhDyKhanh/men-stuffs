import { useTranslations } from '@/lib/i18n';

/**
 * Checkout page - requires user authentication
 */
export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('common.checkout')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-2">Full Name</label>
              <input
                type="text"
                className="w-full border rounded px-4 py-2"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                className="w-full border rounded px-4 py-2"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block mb-2">Address</label>
              <input
                type="text"
                className="w-full border rounded px-4 py-2"
                placeholder="Enter your address"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >
              Place Order
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="border rounded-lg p-6">
            <div className="space-y-4 mb-4">
              {/* Order items */}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

