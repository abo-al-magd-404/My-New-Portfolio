import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, locales } from "./i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get("accept-language");

  const preferredLocale = acceptLanguage
    ?.split(",")
    .map((language) => language.split(";")[0].trim().split("-")[0])
    .find(isLocale);

  const locale = preferredLocale ?? defaultLocale;

  request.nextUrl.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
