import { cache } from "react";

import { isApiError } from "@/lib/api/errors";
import { apiServer } from "@/lib/api/server";

import { getRefreshToken } from "./tokens";

import type { AuthUser } from "@/lib/api/types";

export interface Session {
  userId: string;
  user: AuthUser;
}

export const getSession = cache(async (): Promise<Session | null> => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) return null;

  try {
    const user = await apiServer<AuthUser>({
      path: "/auth/me",
      method: "GET",
    });

    return { userId: user.id, user };
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      return null;
    }

    throw error;
  }
});
