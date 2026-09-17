"use server";

import { redirect } from "next/navigation";

import {
  activateAccountWithPassword,
  findAccountByEmail,
  findAccountByInviteToken,
} from "@/lib/auth/mockData";
import { LOGIN_PATH, safeNextPath } from "@/lib/auth/routes";
import { createSession, destroySession } from "@/lib/auth/session";

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

// TODO: replace the mock account lookups with API calls once the auth backend is available.
export async function login({
  email,
  password,
  next,
}: LoginInput): Promise<ActionResult<LoginError>> {
  const account = findAccountByEmail(email);

  if (!account) return { error: "invalidCredentials", ok: false };

  // The admin added this user but they have not opened their invite link yet, so there are no
  // credentials to check against.
  if (account.status === "invited") return { error: "invitePending", ok: false };

  // The account was activated through Google or GitHub and never got a password.
  if (account.password === null) return { error: "oauthOnly", ok: false };

  if (account.password !== password) return { error: "invalidCredentials", ok: false };

  await createSession(account.userId);
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
  const account = findAccountByInviteToken(token);

  if (!account) return { error: "invalidToken", ok: false };
  if (account.status === "active") return { error: "tokenUsed", ok: false };

  activateAccountWithPassword(account, password);

  await createSession(account.userId);
  redirect(safeNextPath(next));
}

/**
 * Always reports success so the response cannot be used to discover which emails have an account.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  // TODO: call the API to send the reset email once the backend is available.
  console.info("Password reset requested for:", email);
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect(LOGIN_PATH);
}
