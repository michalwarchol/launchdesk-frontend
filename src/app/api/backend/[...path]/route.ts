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
  params: Promise<{ path: string[] }>;
};

async function forwardRequest(
  request: NextRequest,
  path: string,
  accessToken: string | undefined,
): Promise<Response> {
  const url = new URL(`${API_BASE}/${path}`);
  url.search = request.nextUrl.search;

  const headers = new Headers();

  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();

    if (
      lowerKey === "host" ||
      lowerKey === "connection" ||
      lowerKey === "content-length" ||
      lowerKey === "cookie"
    ) {
      return;
    }

    headers.set(key, value);
  });

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const body =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();

  return fetch(url.toString(), {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });
}

async function buildResponse(upstream: Response): Promise<NextResponse> {
  if (upstream.status >= 300 && upstream.status < 400) {
    const location = upstream.headers.get("location");

    if (location) {
      return NextResponse.redirect(location, upstream.status);
    }
  }

  const headers = new Headers();

  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") {
      return;
    }

    headers.set(key, value);
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}

async function handle(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path: pathSegments } = await context.params;
  const path = pathSegments.join("/");

  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  let upstream = await forwardRequest(request, path, accessToken);

  if (upstream.status === 401 && refreshToken) {
    const tokens = await refreshTokens(refreshToken);

    if (tokens) {
      accessToken = tokens.accessToken;
      upstream = await forwardRequest(request, path, accessToken);

      const response = await buildResponse(upstream);
      applyTokenCookies(response, tokens);

      return response;
    }

    const unauthorized = new NextResponse(null, { status: 401 });
    clearTokenCookies(unauthorized);

    return unauthorized;
  }

  return buildResponse(upstream);
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}
