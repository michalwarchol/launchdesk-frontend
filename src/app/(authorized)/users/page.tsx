import { redirect } from "next/navigation";

import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import UsersView from "./UsersView";

export default async function UsersPage() {
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  return <UsersView actorRole={session.user.role} />;
}
