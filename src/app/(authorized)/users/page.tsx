import { redirect } from "next/navigation";

import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";
import { sidebarPageMetadata } from "@/lib/page-metadata";

import UsersView from "./UsersView";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return sidebarPageMetadata("users");
}

export default async function UsersPage() {
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  return <UsersView actorRole={session.user.role} />;
}
