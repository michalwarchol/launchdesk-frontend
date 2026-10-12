import type { UserRole } from "@/lib/api/types";

/** Admins and owners can manage the organization's resources. */
export function isManagerRole(role: UserRole): boolean {
  return role === "admin" || role === "owner";
}

/** Roles an actor may assign when inviting or editing a member. */
export function assignableRoles(actorRole: UserRole): UserRole[] {
  if (actorRole === "owner") return ["user", "admin", "owner"];

  return ["user", "admin"];
}
