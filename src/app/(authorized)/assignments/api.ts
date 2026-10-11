import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

import type {
  Assignment,
  AssignmentQueryParams,
  CreateAssignmentInput,
  PaginatedResponse,
  UpdateAssignmentInput,
} from "@/lib/api/types";

export async function fetchAssignments(params: AssignmentQueryParams = {}) {
  return apiClient<PaginatedResponse<Assignment>>({
    path: "/assignments",
    searchParams: params,
  });
}

export function useAssignmentsQuery(params: AssignmentQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.assignments.list(params),
    queryFn: () => fetchAssignments(params),
    placeholderData: keepPreviousData,
  });
}

export async function fetchAssignment(id: string) {
  return apiClient<Assignment>({
    path: `/assignments/${id}`,
  });
}

export function useAssignmentQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.assignments.detail(id),
    queryFn: () => fetchAssignment(id),
  });
}

export async function createAssignment(input: CreateAssignmentInput) {
  return apiClient<Assignment>({
    path: "/assignments",
    method: "POST",
    body: input,
  });
}

export function useCreateAssignmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all }),
  });
}

export async function unassignUserFromAssignment(assignmentId: string, userId: string) {
  return apiClient<void>({
    path: `/assignments/${assignmentId}/assignees/${userId}`,
    method: "DELETE",
  });
}

export function useUnassignUserFromAssignmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, userId }: { assignmentId: string; userId: string }) =>
      unassignUserFromAssignment(assignmentId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all }),
  });
}

export async function updateAssignment(id: string, input: UpdateAssignmentInput) {
  return apiClient<Assignment>({
    path: `/assignments/${id}`,
    method: "PATCH",
    body: input,
  });
}

export function useUpdateAssignmentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAssignmentInput) => updateAssignment(id, input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.assignments.detail(id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats }),
      ]),
  });
}

export async function deleteAssignment(id: string) {
  return apiClient<void>({
    path: `/assignments/${id}`,
    method: "DELETE",
  });
}

export function useDeleteAssignmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats }),
      ]),
  });
}
