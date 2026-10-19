import { redirect } from "next/navigation";

import { isManagerRole } from "@/lib/auth/roles";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";
import { metadataPageMetadata } from "@/lib/page-metadata";

import TaskDetailsView from "./TaskDetailsView";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("taskDetails");
}

interface TaskDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailsPage({ params }: TaskDetailsPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  const canManage = isManagerRole(session.user.role);

  return <TaskDetailsView taskId={id} canManage={canManage} />;
}
