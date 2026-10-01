import { NextRequest, NextResponse } from "next/server";

import { refreshTokens } from "@/lib/auth/refresh";
import { LOGIN_PATH, safeNextPath } from "@/lib/auth/routes";
import { REFRESH_COOKIE, applyTokenCookies, clearTokenCookies } from "@/lib/auth/tokens";

export async function GET(request: NextRequest) {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return redirectToLogin(request, next);
  }

  const tokens = await refreshTokens(refreshToken);

  if (!tokens) {
    return redirectToLogin(request, next);
  }

  const destination = request.nextUrl.clone();
  const nextUrl = new URL(next, request.url);
  destination.pathname = nextUrl.pathname;
  destination.search = nextUrl.search;

  const response = NextResponse.redirect(destination);
  applyTokenCookies(response, tokens);

  return response;
}

function redirectToLogin(request: NextRequest, next: string): NextResponse {
  const login = request.nextUrl.clone();
  login.pathname = LOGIN_PATH;
  login.search = "";
  login.searchParams.set("next", next);

  const response = NextResponse.redirect(login);
  clearTokenCookies(response);

  return response;
}
