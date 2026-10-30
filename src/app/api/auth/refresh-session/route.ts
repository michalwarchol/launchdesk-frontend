import { NextRequest, NextResponse } from "next/server";

import { publicOrigin } from "@/lib/auth/public-origin";
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

  const destination = new URL(next, publicOrigin(request));

  const response = NextResponse.redirect(destination);
  applyTokenCookies(response, tokens);

  return response;
}

function redirectToLogin(request: NextRequest, next: string): NextResponse {
  const login = new URL(LOGIN_PATH, publicOrigin(request));
  login.searchParams.set("next", next);

  const response = NextResponse.redirect(login);
  clearTokenCookies(response);

  return response;
}
