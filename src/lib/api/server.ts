import { getAccessToken } from "@/lib/auth/tokens";

import { API_BASE } from "./config";
import { fetchJson, fetchRaw } from "./fetcher";

interface ServerRequestOptions extends Omit<RequestInit, "body"> {
  path: string;
  searchParams?: Record<string, string | number | undefined | null>;
  body?: unknown;
}

export async function apiServer<T>({
  path,
  searchParams,
  body,
  ...init
}: ServerRequestOptions): Promise<T> {
  const accessToken = await getAccessToken();

  return fetchJson<T>({
    baseUrl: API_BASE,
    path,
    searchParams,
    body,
    accessToken,
    ...init,
  });
}

export async function apiServerRaw({
  path,
  searchParams,
  ...init
}: Omit<ServerRequestOptions, "body"> & { body?: BodyInit | null }): Promise<Response> {
  const accessToken = await getAccessToken();

  return fetchRaw({
    baseUrl: API_BASE,
    path,
    searchParams,
    accessToken,
    ...init,
  });
}
