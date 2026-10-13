import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { refreshTokens } from "@/lib/auth/refresh";
import { AFTER_LOGIN_PATH, LOGIN_PATH, PATHNAME_HEADER } from "@/lib/auth/routes";
import {
  canMutateCookies,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth/tokens";

import { API_BASE } from "./config";
import { isApiError } from "./errors";
import { fetchJson, fetchRaw } from "./fetcher";

interface ServerRequestOptions extends Omit<RequestInit, "body"> {
  path: string;
  searchParams?: Record<string, string | number | undefined | null>;
  body?: unknown;
}

// These endpoints use 401 for a wrong password or a bad invite, not for an expired session.
const CREDENTIAL_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/invite",
  "/auth/logout",
  "/auth/refresh",
];

function isCredentialPath(path: string): boolean {
  return CREDENTIAL_PATHS.some(
    (credentialPath) => path === credentialPath || path.startsWith(`${credentialPath}/`),
  );
}

function send<T>(options: ServerRequestOptions, accessToken: string | undefined): Promise<T> {
  const { path, searchParams, body, ...init } = options;

  return fetchJson<T>({
    baseUrl: API_BASE,
    path,
    searchParams,
    body,
    accessToken,
    ...init,
  });
}

/**
 * A rejected access token renews the session instead of crashing the page. Server Components cannot
 * write cookies, so they bounce through the refresh route. A Server Action can store the new pair
 * and repeat the call once.
 */
async function recoverFromUnauthorized<T>(options: ServerRequestOptions): Promise<T> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) redirect(LOGIN_PATH);

  const headerStore = await headers();

  if (headerStore.has("next-action") && (await canMutateCookies())) {
    const tokens = await refreshTokens(refreshToken);

    if (!tokens) {
      await clearTokens();
      redirect(LOGIN_PATH);
    }

    await setTokens(tokens.accessToken, tokens.refreshToken);

    return send(options, tokens.accessToken);
  }

  const next = headerStore.get(PATHNAME_HEADER) ?? AFTER_LOGIN_PATH;

  redirect(`/api/auth/refresh-session?next=${encodeURIComponent(next)}`);
}

export async function apiServer<T>(options: ServerRequestOptions): Promise<T> {
  const accessToken = await getAccessToken();

  try {
    return await send(options, accessToken);
  } catch (error) {
    if (!isApiError(error) || error.status !== 401 || isCredentialPath(options.path)) {
      throw error;
    }

    return recoverFromUnauthorized(options);
  }
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
