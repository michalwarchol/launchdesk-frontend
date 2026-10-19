import { getTranslations } from "next-intl/server";

import type { Metadata } from "next";

type SidebarTitleKey =
  | "dashboard"
  | "users"
  | "documents"
  | "tasks"
  | "myTasks"
  | "assignments"
  | "settings"
  | "report";

type MetadataTitleKey =
  | "taskDetails"
  | "editTask"
  | "newTask"
  | "userDetails"
  | "editUser"
  | "documentDetails"
  | "assignmentDetails"
  | "editAssignment"
  | "newAssignment"
  | "myTaskDetails"
  | "login"
  | "register"
  | "forgotPassword"
  | "resetPassword"
  | "acceptInvite";

export async function sidebarPageMetadata(key: SidebarTitleKey): Promise<Metadata> {
  const t = await getTranslations("Sidebar");
  return { title: t(key) };
}

export async function metadataPageMetadata(key: MetadataTitleKey): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return { title: t(key) };
}
