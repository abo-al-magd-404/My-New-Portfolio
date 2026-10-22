"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFoundContent() {
  const pathname = usePathname();
  const isArabic = pathname?.split("/")[1] === "ar";
  const locale = isArabic ? "ar" : "en";

  return (
    <div
      className="flex min-h-[70vh] flex-1 items-center justify-center px-4 py-24"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card/70 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 size-56 -translate-x-1/2 rounded-full bg-brand-gradient opacity-15 blur-3xl"
        />
        <div className="relative">
          <p className="bg-brand-gradient bg-clip-text font-heading text-7xl font-bold tracking-tight text-transparent sm:text-8xl">
            404
          </p>
          <h1 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl">
            {isArabic ? "الصفحة غير موجودة" : "Page not found"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            {isArabic
              ? "يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
              : "The page you are looking for may have been moved or no longer exists."}
          </p>
          <Link
            href={`/${locale}`}
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-brand-gradient px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          >
            {isArabic ? "العودة إلى الرئيسية" : "Back to home"}
          </Link>
        </div>
      </section>
    </div>
  );
}
