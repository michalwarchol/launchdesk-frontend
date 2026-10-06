import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

import type { CreateUserInput, PaginatedResponse, PaginationParams, User } from "@/lib/api/types";

export async function fetchUsers(params: PaginationParams = {}) {
  return apiClient<PaginatedResponse<User>>({
    path: "/users",
    searchParams: params,
  });
}

export function useUsersQuery(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => fetchUsers(params),
    placeholderData: keepPreviousData,
  });
}

export async function createUser(input: CreateUserInput) {
  return apiClient<User>({
    path: "/users",
    method: "POST",
    body: input,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
}
