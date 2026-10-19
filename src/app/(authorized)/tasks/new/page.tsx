import { metadataPageMetadata } from "@/lib/page-metadata";

import NewTaskForm from "./NewTaskForm";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("newTask");
}

export default function NewTaskPage() {
  return <NewTaskForm />;
}
