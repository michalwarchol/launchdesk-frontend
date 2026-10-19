import { redirect } from "next/navigation";

import { isManagerRole } from "@/lib/auth/roles";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";
import { sidebarPageMetadata } from "@/lib/page-metadata";

import DocumentsView from "./DocumentsView";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return sidebarPageMetadata("documents");
}

export default async function DocumentsPage() {
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  const canManage = isManagerRole(session.user.role);

  return <DocumentsView canManage={canManage} />;
}
