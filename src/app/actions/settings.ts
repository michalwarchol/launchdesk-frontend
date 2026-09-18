"use server";

import { revalidatePath } from "next/cache";

import { findAccountByUserId, setAccountPassword, updateUserProfile } from "@/lib/auth/mockData";
import { getSession } from "@/lib/auth/session";

export type UpdateProfileError = "notAuthenticated" | "avatarInvalid";

export type ChangePasswordError =
  | "notAuthenticated"
  | "oauthOnly"
  | "sameAsCurrent"
  | "wrongPassword";

type ActionResult<TError extends string> = { ok: true } | { error: TError; ok: false };

interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  /** A data URL for a freshly picked image, or `undefined` to keep the current avatar. */
  avatar?: string;
}

// TODO: replace the mock mutations with API calls once the account backend is available.
export async function updateProfile({
  firstName,
  lastName,
  avatar,
}: UpdateProfileInput): Promise<ActionResult<UpdateProfileError>> {
  const session = await getSession();

  if (!session) return { error: "notAuthenticated", ok: false };

  // The avatar arrives as a client-encoded data URL, so it cannot be trusted to be an image.
  if (avatar !== undefined && !avatar.startsWith("data:image/")) {
    return { error: "avatarInvalid", ok: false };
  }

  updateUserProfile(session.userId, {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    ...(avatar === undefined ? {} : { avatar }),
  });

  // The sidebar renders the name and avatar from the authorized layout, so the whole tree has to
  // be revalidated rather than just this page.
  revalidatePath("/", "layout");

  return { ok: true };
}

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<ActionResult<ChangePasswordError>> {
  const session = await getSession();

  if (!session) return { error: "notAuthenticated", ok: false };

  const account = findAccountByUserId(session.userId);

  if (!account) return { error: "notAuthenticated", ok: false };

  // The account was activated through Google or GitHub and never got a password.
  if (account.password === null) return { error: "oauthOnly", ok: false };

  if (account.password !== currentPassword) return { error: "wrongPassword", ok: false };

  if (account.password === newPassword) return { error: "sameAsCurrent", ok: false };

  setAccountPassword(account, newPassword);

  return { ok: true };
}
