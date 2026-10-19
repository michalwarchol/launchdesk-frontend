import { metadataPageMetadata } from "@/lib/page-metadata";

import MyTaskPlayer from "./MyTaskPlayer";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("myTaskDetails");
}

interface MyTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function MyTaskPage({ params }: MyTaskPageProps) {
  const { id } = await params;

  return <MyTaskPlayer assignmentId={id} />;
}
