import { isValidLocale, locales } from "@/lib/i18n";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import viVN from "antd/locale/vi_VN";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "vi";
  const antdLocale = locale === "vi" ? viVN : enUS;

  return (
    <AntdRegistry>
      <ConfigProvider locale={antdLocale}>{children}</ConfigProvider>
    </AntdRegistry>
  );
}
