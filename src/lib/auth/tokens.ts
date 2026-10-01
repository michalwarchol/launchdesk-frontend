import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ACCESS_COOKIE = "ld_access";

export const REFRESH_COOKIE = "ld_refresh";

const ACCESS_MAX_AGE = 60 * 15;

const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  const store = await cookies();

  store.set(ACCESS_COOKIE, accessToken, { ...cookieOptions, maxAge: ACCESS_MAX_AGE });
  store.set(REFRESH_COOKIE, refreshToken, { ...cookieOptions, maxAge: REFRESH_MAX_AGE });
}

export async function clearTokens(): Promise<void> {
  const store = await cookies();

  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();

  return store.get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();

  return store.get(REFRESH_COOKIE)?.value;
}

export function applyTokenCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
): void {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_MAX_AGE,
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_MAX_AGE,
  });
}

export function clearTokenCookies(response: NextResponse): void {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}
