import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/mock-products";
import ProductForm from "@/app/[lang]/_components/admin/ProductForm";

type PageProps = {
  params: Promise<{
    lang: string;
    id: string;
  }>;
};

/**
 * Edit product page
 */
export default async function EditProductPage({ params }: PageProps) {
  const { lang, id } = await params;
  const locale = isValidLocale(lang) ? lang : "vi";
  const dict = await getDictionary(locale);
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{dict.admin.editProduct}</h1>
        <Link
          href={`/${locale}/products-management`}
          className="text-gray-600 hover:text-black"
        >
          ← {dict.admin.backToProducts}
        </Link>
      </div>

      <div className="bg-white border rounded-lg p-8 max-w-2xl shadow-sm">
        <ProductForm
          product={product}
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
