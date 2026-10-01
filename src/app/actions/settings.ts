"use server";

import { revalidatePath } from "next/cache";

import { isApiError } from "@/lib/api/errors";
import { apiServer } from "@/lib/api/server";
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

export async function updateProfile({
  firstName,
  lastName,
  avatar,
}: UpdateProfileInput): Promise<ActionResult<UpdateProfileError>> {
  const session = await getSession();

  if (!session) return { error: "notAuthenticated", ok: false };

  if (avatar !== undefined && !avatar.startsWith("data:image/")) {
    return { error: "avatarInvalid", ok: false };
  }

  try {
    await apiServer({
      path: "/users/me",
      method: "PATCH",
      body: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ...(avatar === undefined ? {} : { avatar }),
      },
    });

    revalidatePath("/", "layout");

    return { ok: true };
  } catch (error) {
    if (isApiError(error) && error.code === "avatarInvalid") {
      return { error: "avatarInvalid", ok: false };
    }

    throw error;
  }
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

  try {
    await apiServer({
      path: "/users/me/change-password",
      method: "POST",
      body: { currentPassword, newPassword },
    });

    return { ok: true };
  } catch (error) {
    if (isApiError(error)) {
      if (
        error.code === "oauthOnly" ||
        error.code === "wrongPassword" ||
        error.code === "sameAsCurrent"
      ) {
        return { error: error.code, ok: false };
      }
    }

    throw error;
  }
}
