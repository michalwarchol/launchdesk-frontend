import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

import { uploadDocuments } from "../documents/api";

import type { Attachment } from "@/components/AttachmentsField";
import type {
  CreateTaskInput,
  PaginatedResponse,
  PaginationParams,
  Task,
  TaskDetail,
  UpdateTaskInput,
} from "@/lib/api/types";

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
    placeholderData: keepPreviousData,
  });
}

export async function fetchTask(id: string) {
  return apiClient<TaskDetail>({
    path: `/tasks/${id}`,
  });
}

export function useTaskQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => fetchTask(id),
  });
}

export interface CreateTaskStepValues {
  name: string;
  description: string;
  attachments: Attachment[];
}

export interface CreateTaskValues {
  name: string;
  description: string;
  steps: CreateTaskStepValues[];
}

async function buildTaskInput(values: CreateTaskValues): Promise<CreateTaskInput> {
  const uploads = values.steps.flatMap((step) =>
    step.attachments.filter(
      (attachment): attachment is Extract<Attachment, { kind: "upload" }> =>
        attachment.kind === "upload",
    ),
  );

  const uploadedIdsByLocalId = new Map<string, string>();

  if (uploads.length > 0) {
    const documents = await uploadDocuments(uploads.map((upload) => upload.file));

    uploads.forEach((upload, index) => {
      uploadedIdsByLocalId.set(upload.id, documents[index].id);
    });
  }

  return {
    name: values.name.trim(),
    description: values.description.trim(),
    steps: values.steps.map((step) => ({
      name: step.name.trim(),
      description: step.description,
      attachmentIds: step.attachments.map((attachment) =>
        attachment.kind === "upload"
          ? (uploadedIdsByLocalId.get(attachment.id) as string)
          : attachment.id,
      ),
    })),
  };
}

export async function createTask(values: CreateTaskValues) {
  const input = await buildTaskInput(values);

  return apiClient<TaskDetail>({
    path: "/tasks",
    method: "POST",
    body: input,
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.documents.all }),
      ]),
  });
}

export async function updateTask(id: string, values: CreateTaskValues) {
  const input: UpdateTaskInput = await buildTaskInput(values);

  return apiClient<TaskDetail>({
    path: `/tasks/${id}`,
    method: "PATCH",
    body: input,
  });
}

export function useUpdateTaskMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateTaskValues) => updateTask(id, values),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.documents.all }),
      ]),
  });
}

export async function deleteTask(id: string) {
  return apiClient<void>({
    path: `/tasks/${id}`,
    method: "DELETE",
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
  });
}