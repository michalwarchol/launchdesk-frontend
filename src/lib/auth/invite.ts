import { apiServer } from "@/lib/api/server";
import type { InviteLookup } from "@/lib/api/types";

/**
 * The invited email comes from the token rather than from user input, so the person accepting an
 * invite can never redirect it to a different address.
 */
export async function lookupInvite(token: string | undefined): Promise<InviteLookup> {
  if (!token) return { status: "invalid" };

  return apiServer<InviteLookup>({
    path: "/auth/invite",
    method: "GET",
    searchParams: { token },
  });
}
