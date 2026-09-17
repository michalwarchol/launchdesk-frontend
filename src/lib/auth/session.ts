import { cookies } from "next/headers";

import { User } from "@/app/(authorized)/users/types";

import { findUserById } from "./mockData";
import { SESSION_COOKIE } from "./routes";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface Session {
  userId: string;
  user: User;
}

// TODO: the cookie holds a bare user id because there is no backend to issue a signed token yet.
// Once the API exists it should set the session cookie itself and this becomes a read-only helper.
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const userId = store.get(SESSION_COOKIE)?.value;

  if (!userId) return null;

  const user = findUserById(userId);

  return user ? { userId, user } : null;
}

export async function createSession(userId: string): Promise<void> {
  const store = await cookies();

  store.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
