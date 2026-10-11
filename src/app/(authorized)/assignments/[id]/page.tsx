import { redirect } from "next/navigation";

import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";

import AssignmentDetailsView from "./AssignmentDetailsView";

interface AssignmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentDetailsPage({ params }: AssignmentDetailsPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  const canManage = session.user.role === "admin";

  return <AssignmentDetailsView assignmentId={id} canManage={canManage} />;
}
