import { redirect } from "next/navigation";

import { LOGIN_PATH } from "@/lib/auth/routes";
import { getSession } from "@/lib/auth/session";
import { metadataPageMetadata } from "@/lib/page-metadata";

import DocumentReaderView from "./DocumentReaderView";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("documentDetails");
}

interface DocumentReaderPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentReaderPage({ params }: DocumentReaderPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(LOGIN_PATH);

  return <DocumentReaderView documentId={id} />;
}
