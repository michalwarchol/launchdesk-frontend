import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { parseApiError } from "@/lib/api/errors";
import { queryKeys } from "@/lib/api/query-keys";

import type { Document, PaginatedResponse, PaginationParams } from "@/lib/api/types";

export async function fetchDocuments(params: PaginationParams = {}) {
  return apiClient<PaginatedResponse<Document>>({
    path: "/documents",
    searchParams: params,
  });
}

export async function fetchDocument(id: string) {
  return apiClient<Document>({
    path: `/documents/${id}`,
  });
}

export function useDocumentQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.documents.detail(id),
    queryFn: () => fetchDocument(id),
  });
}

export async function fetchDocumentFile(id: string): Promise<Blob> {
  const response = await fetch(`/api/documents/${encodeURIComponent(id)}/file`);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw parseApiError(response.status, body);
  }

  return response.blob();
}

export function useDocumentFileQuery(id: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.documents.file(id),
    queryFn: () => fetchDocumentFile(id),
    enabled: options.enabled,
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

export async function deleteDocuments(ids: string[]) {
  return apiClient<void>({
    path: "/documents",
    method: "DELETE",
    body: { ids },
  });
}

export function useDeleteDocumentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocuments,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.documents.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
      ]),
  });
}
