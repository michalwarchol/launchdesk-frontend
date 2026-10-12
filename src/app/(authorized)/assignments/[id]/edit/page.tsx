import { redirect } from "next/navigation";

import { isManagerRole } from "@/lib/auth/roles";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import EditAssignmentForm from "./EditAssignmentForm";

interface EditAssignmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAssignmentPage({ params }: EditAssignmentPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  if (!isManagerRole(session.user.role)) {
    redirect(`/assignments/${id}`);
  }

  return <EditAssignmentForm assignmentId={id} />;
}
