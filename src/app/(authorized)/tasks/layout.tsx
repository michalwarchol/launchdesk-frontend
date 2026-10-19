import { sidebarPageMetadata } from "@/lib/page-metadata";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return sidebarPageMetadata("tasks");
}

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
