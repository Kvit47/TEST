import { routing } from "@/src/i18n/routing";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Locale, locales } from "./src/i18n/locales";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createIntlMiddleware(routing);

const protectedRoutes = ["/admin/dashboard", "/profile"];
const authRoutes = ["/auth/signin", "/auth/signup"];

export default async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const pathSegments = pathName.split("/").filter(Boolean);

  const firstSegment = pathSegments[0];
  const isValidLocale = locales.includes(firstSegment as Locale);
  const locale = isValidLocale ? firstSegment : "en";

  const pathWithoutLocale = isValidLocale
    ? `/${pathSegments.slice(1).join("/")}`
    : pathName;

  const isProtectedPage = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  const isAuthPage = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
  }

  if (!token && isProtectedPage) {
    return NextResponse.redirect(
      new URL(`/${locale}/auth/signin`, request.url)
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
