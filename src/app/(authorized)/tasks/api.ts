import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

import type { PaginatedResponse, PaginationParams, Task } from "@/lib/api/types";

export async function fetchTasks(params: PaginationParams = {}) {
  return apiClient<PaginatedResponse<Task>>({
    path: "/tasks",
    searchParams: params,
  });
}

export function useTasksQuery(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.tasks.list(params),
    queryFn: () => fetchTasks(params),
  });
}
