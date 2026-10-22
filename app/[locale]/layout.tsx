import { notFound } from "next/navigation";
import { isLocale } from "../../i18n/config";
import LocaleSync from "../../components/general/LocaleSync";
import Navbar from "../../components/general/Navbar";
import Footer from "../../components/general/Footer";
import { MotionGlobal } from "../../components/general/motion-global";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <LocaleSync locale={locale} />
      <MotionGlobal />
      <Navbar locale={locale} />
      <div className="flex-1 px-3 sm:px-5">
        <main className="relative container mx-auto">{children}</main>
      </div>
      <Footer locale={locale} />
    </>
  );
}
