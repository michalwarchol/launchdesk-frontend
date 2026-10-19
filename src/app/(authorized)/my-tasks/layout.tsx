import { sidebarPageMetadata } from "@/lib/page-metadata";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return sidebarPageMetadata("myTasks");
}

export default function MyTasksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
