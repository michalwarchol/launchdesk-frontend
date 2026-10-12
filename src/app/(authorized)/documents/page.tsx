import { redirect } from "next/navigation";

import { isManagerRole } from "@/lib/auth/roles";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import DocumentsView from "./DocumentsView";

export default async function DocumentsPage() {
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  const canManage = isManagerRole(session.user.role);

  return <DocumentsView canManage={canManage} />;
}
