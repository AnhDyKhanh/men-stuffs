import Link from "next/link";
import { useTranslations } from "@/lib/i18n";
import { cookies } from "next/headers";
import { getUserRole } from "@/lib/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * Store layout - customer-facing UI
 * Includes navigation header and footer
 */
export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await useTranslations(locale as "vi" | "en");
  const cookieStore = await cookies();
  const userRole = getUserRole(cookieStore);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation */}
      <header className="border-b bg-white">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}`} className="text-2xl font-bold">
              Men Stuffs
            </Link>

            <div className="flex items-center gap-6">
              <Link href={`/${locale}`} className="hover:text-gray-600">
                {t("common.home")}
              </Link>
              <Link
                href={`/${locale}/products`}
                className="hover:text-gray-600"
              >
                {t("common.products")}
              </Link>
              <Link href={`/${locale}/cart`} className="hover:text-gray-600">
                {t("common.cart")}
              </Link>

              {userRole === "guest" ? (
                <Link href={`/${locale}/login`} className="hover:text-gray-600">
                  {t("common.login")}
                </Link>
              ) : (
                <>
                  <Link
                    href={`/${locale}/account`}
                    className="hover:text-gray-600"
                  >
                    {t("common.account")}
                  </Link>
                  {userRole === "admin" && (
                    <Link
                      href={`/${locale}/dashboard`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}

              {/* Language Switcher */}
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            © 2024 Men Stuffs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
