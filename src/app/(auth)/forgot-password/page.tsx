import { metadataPageMetadata } from "@/lib/page-metadata";

import ForgotPasswordForm from "./ForgotPasswordForm";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return metadataPageMetadata("forgotPassword");
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
