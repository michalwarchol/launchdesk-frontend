export const SESSION_COOKIE = "ld_session";

export const LOGIN_PATH = "/login";

export const REGISTER_PATH = "/register";

export const AFTER_LOGIN_PATH = "/";

/** Routes reachable without a session. Everything else requires one. */
export const PUBLIC_PATHS = ["/login", "/register", "/invite", "/forgot-password"];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Only same-origin, absolute paths may be used as a redirect target, otherwise the `next` param
 * turns the login page into an open redirect.
 */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return AFTER_LOGIN_PATH;
  }

  return isPublicPath(value) ? AFTER_LOGIN_PATH : value;
}
