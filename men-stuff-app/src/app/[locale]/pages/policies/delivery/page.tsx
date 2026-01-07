import { useTranslations } from '@/lib/i18n';

/**
 * Delivery policy page
 */
export default async function DeliveryPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Delivery Policy</h1>
      <div className="max-w-3xl space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <p className="text-gray-600">
            We offer fast and reliable shipping to all locations. Standard delivery
            takes 3-5 business days, while express delivery is available for 1-2 business days.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Free Shipping</h2>
          <p className="text-gray-600">
            Free shipping is available for orders over $100. All other orders will
            be charged a flat rate shipping fee.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Returns</h2>
          <p className="text-gray-600">
            We accept returns within 30 days of purchase. Items must be in original
            condition with tags attached.
          </p>
        </section>
      </div>
    </div>
  );
}

