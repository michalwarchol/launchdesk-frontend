import { apiServer } from "@/lib/api/server";

import type { DashboardStats } from "@/lib/api/types";

export async function getDashboardStats() {
  return apiServer<DashboardStats>({ path: "/dashboard/stats" });
}
