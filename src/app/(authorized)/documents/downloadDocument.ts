import { BFF_BASE } from "@/lib/api/config";
import { parseApiError } from "@/lib/api/errors";

export type DocumentDownloadResult = "ok" | "fileMissing" | "error";

export async function downloadDocument(id: string): Promise<DocumentDownloadResult> {
  const href = `${BFF_BASE}/documents/${id}/download`;

  try {
    const response = await fetch(href, { redirect: "manual" });

    if (response.type === "opaqueredirect") {
      window.location.assign(href);
      return "ok";
    }

    const body = await response.json().catch(() => null);
    const apiError = parseApiError(response.status, body);

    return apiError.code === "fileMissing" ? "fileMissing" : "error";
  } catch {
    return "error";
  }
}
