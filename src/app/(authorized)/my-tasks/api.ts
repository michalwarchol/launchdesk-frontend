import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

import type { MyAssignment, PaginatedResponse, PaginationParams } from "@/lib/api/types";

export async function fetchMyTasks(params: PaginationParams = {}) {
  return apiClient<PaginatedResponse<MyAssignment>>({
    path: "/assignments/me",
    searchParams: params,
  });
}

export function useMyTasksQuery(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.assignments.mine(params),
    queryFn: () => fetchMyTasks(params),
    placeholderData: keepPreviousData,
  });
}
