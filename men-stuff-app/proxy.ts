import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Supported locales
const locales = ["vi", "en"];
const defaultLocale = "vi";

// Role-based route protection
const protectedRoutes = {
  // Admin-only routes (must start with /admin)
  admin: ["/admin"],
  // User/Admin routes (guest cannot access)
  user: ["/checkout", "/account"],
};

/**
 * Get user role from cookie
 */
function getUserRole(request: NextRequest): "guest" | "user" | "admin" {
  const role = request.cookies.get("role")?.value;
  if (role === "user" || role === "admin") {
    return role;
  }
  return "guest";
}

/**
 * Check if path requires admin role
 */
function isAdminRoute(pathname: string): boolean {
  return protectedRoutes.admin.some((route) => pathname.includes(route));
}

/**
 * Check if path requires user role (user or admin)
 */
function isUserRoute(pathname: string): boolean {
  return protectedRoutes.user.some((route) => pathname.includes(route));
}

/**
 * Extract locale from pathname
 */
function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return segments[0];
  }
  return null;
}

/**
 * Remove locale from pathname
 */
function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return "/" + segments.slice(1).join("/");
  }
  return pathname;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = getUserRole(request);
  const pathWithoutLocale = removeLocaleFromPath(pathname);
  const locale = getLocaleFromPath(pathname);

  // Handle root path - redirect to default locale
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Check if locale is missing - redirect to default locale
  if (!locale) {
    // If path doesn't start with a locale, prepend default locale
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Validate locale
  if (!locales.includes(locale)) {
    // Invalid locale, redirect to default locale
    const newUrl = new URL(
      `/${defaultLocale}${pathWithoutLocale}`,
      request.url
    );
    return NextResponse.redirect(newUrl);
  }

  // Role-based route protection
  // Check admin routes (must start with /admin)
  if (pathWithoutLocale.startsWith("/admin")) {
    if (userRole !== "admin") {
      // Redirect to login if not admin
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check user routes (checkout, account)
  if (isUserRoute(pathWithoutLocale)) {
    if (userRole === "guest") {
      // Redirect to login if guest
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add locale to request headers for use in components
  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  response.headers.set("x-user-role", userRole);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
