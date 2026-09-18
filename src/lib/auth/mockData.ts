import usersMockData from "@/app/(authorized)/users/mockData";
import { User } from "@/app/(authorized)/users/types";
import { toISODate } from "@/utils/isoDate";

// TODO: Delete this file once the auth API is available. Everything here stands in for endpoints
// the backend will own: credential checks, account state and invite tokens. State is kept in module
// scope, so accepting an invite only survives until the server restarts.

/**
 * `invited` means the admin added the user but they have not opened their invite link yet.
 * `active` means they can authenticate, either with a password or through an OAuth provider.
 */
export type AccountStatus = "active" | "invited";

export interface MockAccount {
  userId: string;
  status: AccountStatus;
  /** `null` for accounts that only ever signed in with Google or GitHub. */
  password: string | null;
  inviteToken?: string;
}

const accounts: MockAccount[] = [
  // john.doe@michalwarchol.com - regular email + password sign-in.
  { userId: "1", status: "active", password: "password123" },
  // jane.smith@michalwarchol.com - regular email + password sign-in.
  { userId: "2", status: "active", password: "password123" },
  // alex.nowak@michalwarchol.com - invited, has not set a password yet.
  { userId: "3", status: "invited", password: null, inviteToken: "invite-alex-2f9c" },
  // maria.garcia@michalwarchol.com - accepted her invite with Google, so she has no password.
  { userId: "4", status: "active", password: null },
  // tom.brown@michalwarchol.com - already accepted this invite, the link cannot be reused.
  { userId: "5", status: "active", password: "password123", inviteToken: "invite-tom-8b31" },
];

export function findUserById(userId: string): User | undefined {
  return usersMockData.find((user) => user.id === userId);
}

export function findAccountByEmail(email: string): MockAccount | undefined {
  const user = usersMockData.find(
    (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
  );

  return user ? accounts.find((account) => account.userId === user.id) : undefined;
}

export function findAccountByInviteToken(token: string): MockAccount | undefined {
  return accounts.find((account) => account.inviteToken === token);
}

export function findAccountByUserId(userId: string): MockAccount | undefined {
  return accounts.find((account) => account.userId === userId);
}

/** Replaces the credential of an already active account, as the settings page does. */
export function setAccountPassword(account: MockAccount, password: string): void {
  account.password = password;
}

export type UserProfilePatch = Partial<Pick<User, "firstName" | "lastName" | "avatar">>;

export function updateUserProfile(userId: string, patch: UserProfilePatch): User | undefined {
  const user = usersMockData.find((candidate) => candidate.id === userId);

  if (!user) return undefined;

  Object.assign(user, patch, { updatedAt: toISODate(new Date()) });

  return user;
}

export function activateAccountWithPassword(account: MockAccount, password: string): void {
  account.password = password;
  account.status = "active";
}

/** Links an OAuth identity to an invited account. The provider becomes their only credential. */
export function activateAccountWithProvider(account: MockAccount): void {
  account.status = "active";
}

export function emailForAccount(account: MockAccount): string {
  return findUserById(account.userId)?.email ?? "";
}
