import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "finplan_session";

const APP_PATH_PREFIXES = ["/painel", "/transacoes", "/relatorios", "/orcamentos"];
const AUTH_PATH_PREFIXES = ["/login", "/registro"];

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  // burlar login
  // const skipAuth =
  // process.env.NODE_ENV === "development" && process.env.SKIP_AUTH === "true";
  const skipAuth = process.env.SKIP_AUTH === "true";
  const hasSession = skipAuth || request.cookies.has(SESSION_COOKIE_NAME);

  if (startsWithAny(pathname, APP_PATH_PREFIXES) && !hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (startsWithAny(pathname, AUTH_PATH_PREFIXES) && hasSession) {
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (BFF own handlers)
     * - _next/static, _next/image (static assets)
     * - favicon.ico and other metadata files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
