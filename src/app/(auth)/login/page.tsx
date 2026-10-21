import { redirect } from "next/navigation";

import { BFF_BASE } from "@/lib/api/config";
import { metadataPageMetadata } from "@/lib/page-metadata";

import LoginForm from "./LoginForm";
import { toOAuthCallbackError } from "./schema";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("login");
}

interface LoginPageProps {
  searchParams: Promise<{ code?: string; error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { code, error, next } = await searchParams;

  if (code) {
    // Back from Google / GitHub. The route handler exchanges the one-time code and sets cookies.
    const complete = new URLSearchParams({ code });

    if (next) complete.set("next", next);

    redirect(`/api/auth/oauth/complete?${complete.toString()}`);
  }

  return <LoginForm apiBase={BFF_BASE} next={next} initialError={toOAuthCallbackError(error)} />;
}
