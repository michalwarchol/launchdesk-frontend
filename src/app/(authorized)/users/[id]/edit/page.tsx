import { redirect } from "next/navigation";

import { isApiError } from "@/lib/api/errors";
import { apiServer } from "@/lib/api/server";
import { isManagerRole } from "@/lib/auth/roles";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";
import { metadataPageMetadata } from "@/lib/page-metadata";

import EditUserForm from "./EditUserForm";

import type { User } from "@/lib/api/types";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("editUser");
}

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  if (!isManagerRole(session.user.role)) {
    redirect(`/users/${id}`);
  }

  let target: User | null = null;

  try {
    target = await apiServer<User>({ path: `/users/${id}`, method: "GET" });
  } catch (error) {
    if (!isApiError(error) || error.status !== 404) throw error;
  }

  const isSelf = session.user.id === id;
  const canEdit =
    target === null ||
    ((session.user.role === "owner" || target.role !== "owner") &&
      !(target.isLastOwner && !isSelf));

  if (!canEdit) redirect(`/users/${id}`);

  return (
    <EditUserForm
      userId={id}
      actorRole={session.user.role}
      lockRole={Boolean(target?.isLastOwner && isSelf)}
    />
  );
}
