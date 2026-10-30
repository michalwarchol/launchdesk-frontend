import type { NextRequest } from "next/server";

/** First value when proxies append comma-separated forwarded headers. */
function firstHeaderValue(value: string | null): string | undefined {
  if (!value) return undefined;

  return value.split(",")[0]?.trim() || undefined;
}

/**
 * Public site origin for absolute redirects behind a reverse proxy. Standalone Next binds to
 * `0.0.0.0:3000`, so `request.nextUrl` is not safe for `Location` in production.
 */
export function publicOrigin(request: NextRequest): string {
  const host =
    firstHeaderValue(request.headers.get("x-forwarded-host")) ??
    firstHeaderValue(request.headers.get("host"));

  const protocol =
    firstHeaderValue(request.headers.get("x-forwarded-proto")) ??
    request.nextUrl.protocol.replace(":", "");

  if (!host) {
    return request.nextUrl.origin;
  }

  return `${protocol}://${host}`;
}
