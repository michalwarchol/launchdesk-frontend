import { metadataPageMetadata } from "@/lib/page-metadata";

import NewAssignmentForm from "./NewAssignmentForm";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("newAssignment");
}

export default function NewAssignmentPage() {
  return <NewAssignmentForm />;
}
