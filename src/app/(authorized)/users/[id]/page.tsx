import { redirect } from "next/navigation";

import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import UserDetailsView from "./UserDetailsView";

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  const canManage = session.user.role === "admin";
  const isSelf = session.user.id === id;

  return <UserDetailsView userId={id} canManage={canManage} isSelf={isSelf} />;
}
