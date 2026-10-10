import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

import type {
  CreateUserInput,
  PaginatedResponse,
  PaginationParams,
  UpdateUserInput,
  User,
} from "@/lib/api/types";

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

export async function fetchUser(id: string) {
  return apiClient<User>({
    path: `/users/${id}`,
  });
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => fetchUser(id),
  });
}

export async function updateUser(id: string, input: UpdateUserInput) {
  return apiClient<User>({
    path: `/users/${id}`,
    method: "PATCH",
    body: input,
  });
}

export function useUpdateUserMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}

export async function deleteUser(id: string) {
  return apiClient<void>({
    path: `/users/${id}`,
    method: "DELETE",
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
}
