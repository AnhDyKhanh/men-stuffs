import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import enUS from "antd/locale/en_US";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const antdLocale = params.locale === "vi" ? viVN : enUS;

  return (
    <AntdRegistry>
      <ConfigProvider locale={antdLocale}>{children}</ConfigProvider>
    </AntdRegistry>
  );
}
