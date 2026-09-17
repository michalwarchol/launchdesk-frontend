import { emailForAccount, findAccountByInviteToken } from "./mockData";

export type InviteLookup =
  | { status: "invalid" }
  | { status: "used"; email: string }
  | { status: "valid"; email: string; token: string };

/**
 * The invited email comes from the token rather than from user input, so the person accepting an
 * invite can never redirect it to a different address.
 */
export function lookupInvite(token: string | undefined): InviteLookup {
  if (!token) return { status: "invalid" };

  const account = findAccountByInviteToken(token);

  if (!account) return { status: "invalid" };

  return account.status === "active"
    ? { status: "used", email: emailForAccount(account) }
    : { status: "valid", email: emailForAccount(account), token };
}
