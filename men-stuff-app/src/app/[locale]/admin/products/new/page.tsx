import { useTranslations } from '@/lib/i18n';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';

/**
 * Create new product page
 */
export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as 'vi' | 'en');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('admin.createProduct')}</h1>
        <Link
          href={`/${locale}/admin/products`}
          className="text-gray-600 hover:text-black"
        >
          ← {t('admin.backToProducts')}
        </Link>
      </div>

      <div className="bg-white border rounded-lg p-8 max-w-2xl shadow-sm">
        <ProductForm
          locale={locale}
          translations={{
            productName: t('admin.productName'),
            productNameVi: t('admin.productNameVi'),
            productNameEn: t('admin.productNameEn'),
            productPrice: t('admin.productPrice'),
            productStatus: t('admin.status'),
            active: t('admin.active'),
            inactive: t('admin.inactive'),
            save: t('admin.save'),
            cancel: t('admin.cancel'),
          }}
        />
      </div>
    </div>
  );
}

