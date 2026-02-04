import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import ProductForm from "@/app/[lang]/_components/admin/ProductForm";

/**
 * Create new product page
 */
export default async function NewProductPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "vi";
  const dict = await getDictionary(locale);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{dict.admin.createProduct}</h1>
        <Link
          href={`/${locale}/products-management`}
          className="text-gray-600 hover:text-black"
        >
          ← {dict.admin.backToProducts}
        </Link>
      </div>

      <div className="bg-white border rounded-lg p-8 max-w-2xl shadow-sm">
        <ProductForm
          lang={locale}
          translations={{
            productName: dict.admin.productName,
            productNameVi: dict.admin.productNameVi,
            productNameEn: dict.admin.productNameEn,
            productPrice: dict.admin.productPrice,
            productStatus: dict.admin.status,
            active: dict.admin.active,
            inactive: dict.admin.inactive,
            save: dict.admin.save,
            cancel: dict.admin.cancel,
          }}
        />
      </div>
    </div>
  );
}
