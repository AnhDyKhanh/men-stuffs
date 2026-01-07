import { locales, defaultLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

/**
 * Locale layout - validates locale and provides locale context
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return <>{children}</>;
}

/**
 * Generate static params for all locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
