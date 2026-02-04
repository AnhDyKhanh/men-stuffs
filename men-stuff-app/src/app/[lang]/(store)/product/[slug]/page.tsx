import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

/**
 * Product detail page
 */
export default async function ProductDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = isValidLocale(lang) ? lang : "vi";
  const dict = await getDictionary(locale);

  // Mock product data - replace with real data fetching
  const product = {
    id: 1,
    name: "Product 1",
    slug: slug,
    price: 99.99,
    description:
      "This is a detailed product description. It includes all the features and benefits of the product.",
  };

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-200 h-96 rounded-lg"></div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold mb-6">${product.price}</p>
          <p className="text-gray-600 mb-8">{product.description}</p>

          <div className="flex gap-4">
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition flex-1">
              {dict.products.addToCart}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
