import { cache } from "react";

import { isApiError } from "@/lib/api/errors";
import { apiServer } from "@/lib/api/server";
import type { User } from "@/lib/api/types";

import { getRefreshToken } from "./tokens";

export interface Session {
  userId: string;
  user: User;
}

export const getSession = cache(async (): Promise<Session | null> => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) return null;

  try {
    const user = await apiServer<User>({
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
