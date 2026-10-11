import { redirect } from "next/navigation";

import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import DocumentsView from "./DocumentsView";

export default async function DocumentsPage() {
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  const canManage = session.user.role === "admin";

  return <DocumentsView canManage={canManage} />;
}
