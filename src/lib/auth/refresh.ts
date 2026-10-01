import { API_BASE } from "@/lib/api/config";

import type { AuthTokens } from "@/lib/api/types";

const inflight = new Map<string, Promise<AuthTokens | null>>();

export function refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
  const existing = inflight.get(refreshToken);

  if (existing) return existing;

  const pending = requestRefresh(refreshToken).finally(() => {
    inflight.delete(refreshToken);
  });

  inflight.set(refreshToken, pending);

  return pending;
}

async function requestRefresh(refreshToken: string): Promise<AuthTokens | null> {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  return response.json() as Promise<AuthTokens>;
}
