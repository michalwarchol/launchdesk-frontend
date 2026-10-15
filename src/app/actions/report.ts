"use server";

import { isApiError } from "@/lib/api/errors";
import { apiServer } from "@/lib/api/server";
import { getSession } from "@/lib/auth/session";

import type { ReportFormValues } from "@/app/(authorized)/report/schema";

export type SubmitReportError = "notAuthenticated" | "generic";

type ActionResult = { ok: true } | { error: SubmitReportError; ok: false };

export async function submitReport({
  purpose,
  description,
}: ReportFormValues): Promise<ActionResult> {
  const session = await getSession();

  if (!session) return { error: "notAuthenticated", ok: false };

  try {
    await apiServer({
      path: "/reports",
      method: "POST",
      body: { purpose, description: description.trim() },
    });

    return { ok: true };
  } catch (error) {
    if (isApiError(error)) {
      return { error: "generic", ok: false };
    }

    throw error;
  }
}
