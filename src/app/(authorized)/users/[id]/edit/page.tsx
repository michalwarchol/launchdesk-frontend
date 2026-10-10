import { redirect } from "next/navigation";

import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import EditUserForm from "./EditUserForm";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  if (session.user.role !== "admin") {
    redirect(`/users/${id}`);
  }

  return <EditUserForm userId={id} />;
}
