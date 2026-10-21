"use client";

import { useEffect, useLayoutEffect } from "react";
import type { Locale } from "@/i18n/config";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function LocaleSync({ locale }: { locale: Locale }) {
  useIsoLayoutEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
