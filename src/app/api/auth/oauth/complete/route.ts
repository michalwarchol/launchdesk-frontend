import { NextRequest, NextResponse } from "next/server";

import { API_BASE } from "@/lib/api/config";
import { LOGIN_PATH, safeNextPath } from "@/lib/auth/routes";
import { applyTokenCookies } from "@/lib/auth/tokens";

import type { AuthTokens } from "@/lib/api/types";

/**
 * Last step of Google / GitHub sign-in. The backend redirects to `/login?code=...`, the login page
 * forwards here, and this handler trades the one-time code for tokens and stores them in the
 * session cookies. It is a route handler because cookies cannot be written while a page renders.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (!code) {
    return redirectToLogin(request, next);
  }

  const tokens = await exchangeCode(code);

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

async function exchangeCode(code: string): Promise<AuthTokens | null> {
  try {
    const response = await fetch(`${API_BASE}/auth/oauth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) return null;

    return (await response.json()) as AuthTokens;
  } catch {
    return null;
  }
}

/** An expired or already used code must end on the login page with an error, never loop. */
function redirectToLogin(request: NextRequest, next: string): NextResponse {
  const login = request.nextUrl.clone();
  login.pathname = LOGIN_PATH;
  login.search = "";
  login.searchParams.set("error", "providerFailed");
  login.searchParams.set("next", next);

  return NextResponse.redirect(login);
}
