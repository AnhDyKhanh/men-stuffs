import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ lang: string }>;
};

/**
 * About page
 */
export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "vi";
  const dict = await getDictionary(locale);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      <div className="max-w-3xl">
        <p className="text-lg text-gray-600 mb-4">
          Welcome to Men Stuffs, your premier destination for quality men's
          products.
        </p>
        <p className="text-lg text-gray-600">
          We are committed to providing the best shopping experience with a wide
          selection of products and excellent customer service.
        </p>
      </div>
    </div>
  );
}
