import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip paths that already contain a supported locale.
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect the preferred language from the browser.
  const acceptLanguage = request.headers.get("accept-language");

  const preferredLocale = acceptLanguage
    ?.split(",")
    .map((language) => language.split(";")[0].trim().split("-")[0])
    .find((language) => locales.includes(language as (typeof locales)[number]));

  const locale = preferredLocale ?? defaultLocale;

  // Redirect to the matching locale path.
  request.nextUrl.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
