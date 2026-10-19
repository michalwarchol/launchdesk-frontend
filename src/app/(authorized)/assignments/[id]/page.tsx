import { redirect } from "next/navigation";

import { isManagerRole } from "@/lib/auth/roles";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";
import { metadataPageMetadata } from "@/lib/page-metadata";

import AssignmentDetailsView from "./AssignmentDetailsView";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("assignmentDetails");
}

interface AssignmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentDetailsPage({ params }: AssignmentDetailsPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  const canManage = isManagerRole(session.user.role);

  return <AssignmentDetailsView assignmentId={id} canManage={canManage} />;
}
