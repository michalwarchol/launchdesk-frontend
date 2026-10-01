"use server";

import { redirect } from "next/navigation";

import { isApiError } from "@/lib/api/errors";
import { apiServer } from "@/lib/api/server";
import type { AuthTokens } from "@/lib/api/types";
import { LOGIN_PATH, safeNextPath } from "@/lib/auth/routes";
import { clearTokens, getRefreshToken, setTokens } from "@/lib/auth/tokens";

export type LoginError = "invalidCredentials" | "invitePending" | "oauthOnly";

export type AcceptInviteError = "invalidToken" | "tokenUsed";

/**
 * Actions that authenticate redirect on success, in which case the caller receives `undefined`
 * because the action never returns.
 */
type ActionResult<TError extends string> = { error: TError; ok: false } | undefined;

interface LoginInput {
  email: string;
  password: string;
  next?: string;
}

export async function login({
  email,
  password,
  next,
}: LoginInput): Promise<ActionResult<LoginError>> {
  let tokens: AuthTokens;

  try {
    tokens = await apiServer<AuthTokens>({
      path: "/auth/login",
      method: "POST",
      body: { email, password },
    });
  } catch (error) {
    if (isApiError(error)) {
      if (
        error.code === "invalidCredentials" ||
        error.code === "invitePending" ||
        error.code === "oauthOnly"
      ) {
        return { error: error.code, ok: false };
      }
    }

    throw error;
  }

  await setTokens(tokens.accessToken, tokens.refreshToken);
  redirect(safeNextPath(next));
}

interface AcceptInviteInput {
  token: string;
  password: string;
  next?: string;
}

export async function acceptInvite({
  token,
  password,
  next,
}: AcceptInviteInput): Promise<ActionResult<AcceptInviteError>> {
  let tokens: AuthTokens;

  try {
    tokens = await apiServer<AuthTokens>({
      path: "/auth/invite/accept",
      method: "POST",
      body: { token, password },
    });
  } catch (error) {
    if (isApiError(error)) {
      if (error.code === "invalidToken") {
        return { error: "invalidToken", ok: false };
      }

      if (error.code === "tokenUsed") {
        return { error: "tokenUsed", ok: false };
      }
    }

    throw error;
  }

  await setTokens(tokens.accessToken, tokens.refreshToken);
  redirect(safeNextPath(next));
}

/**
 * Always reports success so the response cannot be used to discover which emails have an account.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await apiServer({
      path: "/auth/forgot-password",
      method: "POST",
      body: { email },
    });
  } catch {
    // Intentionally swallow errors to avoid email enumeration.
  }
}

export async function logout(): Promise<void> {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    try {
      await apiServer({
        path: "/auth/logout",
        method: "POST",
        body: { refreshToken },
      });
    } catch {
      // Clear local session even when the backend rejects the token.
    }
  }

  await clearTokens();
  redirect(LOGIN_PATH);
}
