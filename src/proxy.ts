import { NextRequest, NextResponse } from "next/server";

import {
  AFTER_LOGIN_PATH,
  isPublicPath,
  LOGIN_PATH,
  PATHNAME_HEADER,
  REGISTER_PATH,
} from "@/lib/auth/routes";
import { REFRESH_COOKIE } from "@/lib/auth/tokens";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(REFRESH_COOKIE)?.value);

  if (isPublicPath(pathname)) {
    // Nothing to do on the login or register screen when already signed in. Invite acceptance stays
    // reachable so that a signed-in user can still accept an invite addressed to another account.
    if (hasSession && (pathname === LOGIN_PATH || pathname === REGISTER_PATH)) {
      const target = request.nextUrl.clone();
      target.pathname = AFTER_LOGIN_PATH;
      target.search = "";

      return NextResponse.redirect(target);
    }

    return NextResponse.next();
  }

  if (hasSession) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(PATHNAME_HEADER, `${pathname}${search}`);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Route groups such as `(authorized)` are invisible here because they never appear in the URL, so
  // every non-public path is treated as protected.
  const login = request.nextUrl.clone();
  login.pathname = LOGIN_PATH;
  login.search = "";
  login.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};
