import { metadataPageMetadata } from "@/lib/page-metadata";

import RegisterForm from "./RegisterForm";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("register");
}

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { next } = await searchParams;

  return <RegisterForm next={next} />;
}
