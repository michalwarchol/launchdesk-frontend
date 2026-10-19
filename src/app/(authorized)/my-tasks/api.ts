import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

import type {
  MyAssignment,
  MyTask,
  PaginatedResponse,
  PaginationParams,
} from "@/lib/api/types";

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

export async function fetchMyTask(id: string) {
  return apiClient<MyTask>({
    path: `/assignments/me/${id}`,
  });
}

export function useMyTaskQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.assignments.mineDetail(id),
    queryFn: () => fetchMyTask(id),
  });
}

export async function setStepCompletion(
  id: string,
  stepId: string,
  completed: boolean,
  notes: string,
) {
  return apiClient<MyTask>({
    path: `/assignments/me/${id}/steps/${stepId}`,
    method: "PATCH",
    body: { completed, notes },
  });
}

export function useSetStepCompletionMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stepId,
      completed,
      notes,
    }: {
      stepId: string;
      completed: boolean;
      notes: string;
    }) => setStepCompletion(id, stepId, completed, notes),
    onSuccess: (task) => {
      queryClient.setQueryData(queryKeys.assignments.mineDetail(id), task);
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.all,
        predicate: (query) => query.queryKey[2] !== "detail" || query.queryKey[3] !== id,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}
