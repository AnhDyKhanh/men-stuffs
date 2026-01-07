import { useTranslations } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/mock-products";
import ProductForm from "@/app/[locale]/_components/admin/ProductForm";

/**
 * Edit product page
 */
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await useTranslations(locale as "vi" | "en");
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("admin.editProduct")}</h1>
        <Link
          href={`/${locale}/admin/products`}
          className="text-gray-600 hover:text-black"
        >
          ← {t("admin.backToProducts")}
        </Link>
      </div>

      <div className="bg-white border rounded-lg p-8 max-w-2xl shadow-sm">
        <ProductForm
          product={product}
          locale={locale}
          translations={{
            productName: t("admin.productName"),
            productNameVi: t("admin.productNameVi"),
            productNameEn: t("admin.productNameEn"),
            productPrice: t("admin.productPrice"),
            productStatus: t("admin.status"),
            active: t("admin.active"),
            inactive: t("admin.inactive"),
            save: t("admin.save"),
            cancel: t("admin.cancel"),
          }}
        />
      </div>
    </div>
  );
}
