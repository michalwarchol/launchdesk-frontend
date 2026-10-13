import type { UserRole } from "@/lib/api/types";

export const LOGIN_PATH = "/login";

export const REGISTER_PATH = "/register";

export const AFTER_LOGIN_PATH = "/dashboard";

export const USER_HOME_PATH = "/settings";

/** Request header set by the proxy so protected layouts know which URL they are rendering. */
export const PATHNAME_HEADER = "x-pathname";

/** Routes reachable without a session. Everything else requires one. */
export const PUBLIC_PATHS = ["/login", "/register", "/invite", "/forgot-password"];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/** The user role can open Settings and nothing else in the app shell. */
export function isUserAllowedPath(pathname: string): boolean {
  const path = pathname.split("?")[0] ?? "";
  return path === USER_HOME_PATH;
}

/**
 * Managers keep the requested path. Users are sent to Settings unless that path is already allowed.
 */
export function homePathForRole(role: UserRole, next?: string | null): string {
  const destination = safeNextPath(next);

  if (role === "user" && !isUserAllowedPath(destination)) {
    return USER_HOME_PATH;
  }

  return destination;
}

/**
 * Only same-origin, absolute paths may be used as a redirect target, otherwise the `next` param
 * turns the login page into an open redirect. `/` is the placeholder outside the app shell, so it
 * is not a destination either.
 */
export function safeNextPath(value: string | null | undefined): string {
  if (
    !value ||
    value === "/" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return AFTER_LOGIN_PATH;
  }

  return isPublicPath(value) ? AFTER_LOGIN_PATH : value;
}
