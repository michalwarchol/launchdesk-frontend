import { parseApiError } from "./errors";

export interface FetchJsonOptions extends Omit<RequestInit, "body"> {
  baseUrl: string;
  path: string;
  searchParams?: Record<string, string | number | undefined | null>;
  body?: unknown;
  accessToken?: string | null;
}

function buildUrl(
  baseUrl: string,
  path: string,
  searchParams?: Record<string, string | number | undefined | null>,
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pathname = `${baseUrl.replace(/\/$/, "")}${normalizedPath}`;
  const isAbsolute = pathname.startsWith("http://") || pathname.startsWith("https://");

  // Relative paths (e.g. the BFF at /api/backend) are valid for fetch() but not for new URL() alone.
  const url = isAbsolute ? new URL(pathname) : new URL(pathname, "http://local");

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return isAbsolute ? url.toString() : `${url.pathname}${url.search}`;
}

function buildHeaders(
  initHeaders: HeadersInit | undefined,
  accessToken: string | null | undefined,
  body: unknown,
): Headers {
  const headers = new Headers(initHeaders);

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // `FormData` bodies must not get a Content-Type so the runtime can add the multipart boundary.
  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

export async function fetchJson<T>({
  baseUrl,
  path,
  searchParams,
  body,
  accessToken,
  ...init
}: FetchJsonOptions): Promise<T> {
  const hasJsonBody = body !== undefined && body !== null;
  const response = await fetch(buildUrl(baseUrl, path, searchParams), {
    ...init,
    headers: buildHeaders(init.headers, accessToken, hasJsonBody ? body : undefined),
    body: hasJsonBody ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw parseApiError(response.status, payload);
  }

  return payload as T;
}

export async function fetchRaw({
  baseUrl,
  path,
  searchParams,
  accessToken,
  ...init
}: Omit<FetchJsonOptions, "body"> & { body?: BodyInit | null }): Promise<Response> {
  const headers = new Headers(init.headers);

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(buildUrl(baseUrl, path, searchParams), {
    ...init,
    headers,
  });
}
