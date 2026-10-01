import type { AssignmentQueryParams, PaginationParams } from "./types";

export const queryKeys = {
  tasks: {
    all: ["tasks"] as const,
    list: (params: PaginationParams = {}) => ["tasks", "list", params] as const,
    detail: (id: string) => ["tasks", "detail", id] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params: PaginationParams = {}) => ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  assignments: {
    all: ["assignments"] as const,
    list: (params: AssignmentQueryParams = {}) => ["assignments", "list", params] as const,
    mine: (params: PaginationParams = {}) => ["assignments", "mine", params] as const,
    detail: (id: string) => ["assignments", "detail", id] as const,
  },
  documents: {
    all: ["documents"] as const,
    list: (params: PaginationParams = {}) => ["documents", "list", params] as const,
    detail: (id: string) => ["documents", "detail", id] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
};
