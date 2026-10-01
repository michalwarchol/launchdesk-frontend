import { BFF_BASE } from "./config";
import { fetchJson, fetchRaw } from "./fetcher";

interface ClientRequestOptions extends Omit<RequestInit, "body"> {
  path: string;
  searchParams?: Record<string, string | number | undefined | null>;
  body?: unknown;
}

export async function apiClient<T>({
  path,
  searchParams,
  body,
  ...init
}: ClientRequestOptions): Promise<T> {
  return fetchJson<T>({
    baseUrl: BFF_BASE,
    path,
    searchParams,
    body,
    ...init,
  });
}

export async function apiClientRaw({
  path,
  searchParams,
  ...init
}: Omit<ClientRequestOptions, "body"> & { body?: BodyInit | null }): Promise<Response> {
  return fetchRaw({
    baseUrl: BFF_BASE,
    path,
    searchParams,
    ...init,
  });
}
