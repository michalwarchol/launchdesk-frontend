import { sidebarPageMetadata } from "@/lib/page-metadata";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return sidebarPageMetadata("assignments");
}

export default function AssignmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
