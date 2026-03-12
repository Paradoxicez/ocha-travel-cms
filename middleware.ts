import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const locales = ["th", "en"];
const defaultLocale = "th";

export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Admin routes — auth.js handles authorization via the `authorized` callback
  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    const isLoggedIn = !!request.auth?.user;

    if (!isLogin && !isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    if (isLogin && isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Skip API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if locale is in pathname
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/((?!_next|api|logos|uploads|.*\\..*).*)"],
};
