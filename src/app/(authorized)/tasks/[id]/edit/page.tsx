import { redirect } from "next/navigation";

import { isManagerRole } from "@/lib/auth/roles";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";
import { metadataPageMetadata } from "@/lib/page-metadata";

import EditTaskForm from "./EditTaskForm";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("editTask");
}

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  if (!isManagerRole(session.user.role)) {
    redirect(`/tasks/${id}`);
  }

  return <EditTaskForm taskId={id} />;
}
