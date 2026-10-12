import { redirect } from "next/navigation";

import { isManagerRole } from "@/lib/auth/roles";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import EditTaskForm from "./EditTaskForm";

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
