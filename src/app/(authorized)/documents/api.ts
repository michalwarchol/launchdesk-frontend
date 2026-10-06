import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

import type { Document, PaginatedResponse, PaginationParams } from "@/lib/api/types";

export async function fetchDocuments(params: PaginationParams = {}) {
  return apiClient<PaginatedResponse<Document>>({
    path: "/documents",
    searchParams: params,
  });
}

export function useDocumentsQuery(
  params: PaginationParams = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: queryKeys.documents.list(params),
    queryFn: () => fetchDocuments(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled,
  });
}

export async function uploadDocuments(files: File[]) {
  const body = new FormData();

  for (const file of files) {
    body.append("files", file);
  }

  return apiClient<Document[]>({
    path: "/documents",
    method: "POST",
    body,
  });
}

export function useUploadDocumentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocuments,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.documents.all }),
  });
}
