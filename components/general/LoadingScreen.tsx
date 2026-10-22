"use client";

import { usePathname } from "next/navigation";

export default function LoadingScreen() {
  const pathname = usePathname();
  const isArabic = pathname?.split("/")[1] === "ar";

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      role="status"
      className="flex min-h-[60vh] flex-1 items-center justify-center px-4 py-24"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative flex size-20 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-border border-t-brand-blue motion-reduce:animate-none" />
          <span className="size-10 animate-pulse rounded-full bg-brand-gradient shadow-[0_0_32px_var(--glow-violet)] motion-reduce:animate-none" />
        </div>
        <div className="space-y-2">
          <p className="font-heading text-sm font-bold tracking-wide text-foreground sm:text-base">
            {isArabic ? "محمد محمود أبو المجد" : "Mohamed Mahmoud Abo al magd"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isArabic ? "جارٍ تحميل الصفحة..." : "Loading your page..."}
          </p>
        </div>
      </div>
    </div>
  );
}
