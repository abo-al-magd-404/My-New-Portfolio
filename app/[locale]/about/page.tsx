import MotionHydrationBoundary from "../../../components/general/MotionHydrationBoundary";
import { getPageMetadata } from "../../../lib/metadata";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    locale: "en" | "ar";
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, "about");
}

export default async function About({ params }: PageProps) {
  const { locale } = await params;

  return (
    <MotionHydrationBoundary>
      <div className="w-full h-screen flex flex-col pt-20 justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">
          {locale === "ar" ? "نبذة عني" : "About Me"}
        </h1>
        <h3 className="text-xl text-muted-foreground">
          {locale === "ar"
            ? "محمد محمود أبو المجد"
            : "Mohamed Mahmoud Abo al magd"}
        </h3>
      </div>
    </MotionHydrationBoundary>
  );
}
