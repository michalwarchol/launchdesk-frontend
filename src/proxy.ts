import { NextRequest, NextResponse } from "next/server";

import { AFTER_LOGIN_PATH, isPublicPath, LOGIN_PATH, SESSION_COOKIE } from "@/lib/auth/routes";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isPublicPath(pathname)) {
    // Nothing to do on the login screen when already signed in. Invite acceptance stays reachable
    // so that a signed-in user can still accept an invite addressed to another account.
    if (hasSession && pathname === LOGIN_PATH) {
      const target = request.nextUrl.clone();
      target.pathname = AFTER_LOGIN_PATH;
      target.search = "";

      return NextResponse.redirect(target);
    }

    return NextResponse.next();
  }

  if (hasSession) return NextResponse.next();

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
