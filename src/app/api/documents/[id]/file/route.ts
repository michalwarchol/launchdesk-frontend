import { NextRequest, NextResponse } from "next/server";

import { API_BASE } from "@/lib/api/config";
import { refreshTokens } from "@/lib/auth/refresh";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  applyTokenCookies,
  clearTokenCookies,
} from "@/lib/auth/tokens";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function proxyBody(upstream: Response): NextResponse {
  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") ?? "application/octet-stream");
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Content-Type-Options", "nosniff");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}

async function requestDownload(id: string, accessToken: string | undefined): Promise<Response> {
  const headers = new Headers();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(`${API_BASE}/documents/${encodeURIComponent(id)}/download`, {
    headers,
    redirect: "manual",
  });
}

// The API answers with a presigned URL that forces a download. Follow it here so the browser
// can read the bytes without depending on storage CORS.
async function toClientResponse(upstream: Response): Promise<NextResponse> {
  if (upstream.status < 300 || upstream.status >= 400) {
    return proxyBody(upstream);
  }

  const location = upstream.headers.get("location");

  if (!location || !isHttpUrl(location)) {
    return new NextResponse(null, { status: 502 });
  }

  try {
    const file = await fetch(location, { redirect: "manual" });

    if (file.status >= 300 && file.status < 400) {
      return new NextResponse(null, { status: 502 });
    }

    return proxyBody(file);
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  let upstream = await requestDownload(id, accessToken);
  let tokens: { accessToken: string; refreshToken: string } | null = null;

  if (upstream.status === 401 && refreshToken) {
    tokens = await refreshTokens(refreshToken);

    if (!tokens) {
      const unauthorized = new NextResponse(null, { status: 401 });
      clearTokenCookies(unauthorized);

      return unauthorized;
    }

    accessToken = tokens.accessToken;
    upstream = await requestDownload(id, accessToken);
  }

  const response = await toClientResponse(upstream);

  if (tokens) {
    applyTokenCookies(response, tokens);
  }

  return response;
}
