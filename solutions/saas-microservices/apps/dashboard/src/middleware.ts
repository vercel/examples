import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const currentUrl = request.nextUrl;
  const authedUser = request.cookies.get("saas_microservices_authed_user");
  if (!authedUser && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", currentUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
