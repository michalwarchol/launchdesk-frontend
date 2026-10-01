export type UserRole = "admin" | "user";

export type DocumentType = "image" | "spreadsheet" | "text";

export type AssignmentStatus = "completed" | "overdue" | "inProgress" | "notStarted";

export type InviteStatus = "valid" | "used" | "invalid";

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  [key: string]: string | number | undefined;
}

export interface PaginatedMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type InviteLookup =
  | { status: "invalid" }
  | { status: "used"; email: string }
  | { status: "valid"; email: string; token: string };

export interface Task {
  id: string;
  name: string;
  description: string;
  stepsCount: number;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  extension: string;
  size: number;
  createdAt: string;
}

export interface TaskStep {
  id: string;
  name: string;
  description: string;
  position: number;
  attachments: Document[];
}

export interface TaskDetail extends Task {
  steps: TaskStep[];
}

export interface AssignmentAssignee {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Assignment {
  id: string;
  taskId: string;
  taskName: string;
  assignees: AssignmentAssignee[];
  progress: number;
  dueDate: string;
  createdAt: string;
  completedAt?: string | null;
}

export interface AssignmentQueryParams extends PaginationParams {
  status?: AssignmentStatus;
  taskId?: string;
  assigneeId?: string;
}

export interface DashboardStats {
  totals: {
    assignments: number;
    completed: number;
    overdue: number;
    active: number;
    notStarted: number;
    completionRate: number;
    tasks: number;
    averageStepsPerTask: number;
    users: number;
    admins: number;
    usersWithActiveWork: number;
  };
  statusBreakdown: Array<{
    status: AssignmentStatus;
    count: number;
  }>;
  monthlyActivity: Array<{
    monthKey: string;
    monthLabel: string;
    created: number;
    completed: number;
  }>;
  topTasks: Array<{
    taskId: string;
    taskName: string;
    count: number;
  }>;
  workload: Array<{
    userId: string;
    name: string;
    avatar?: string;
    count: number;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    taskId: string;
    taskName: string;
    assignees: AssignmentAssignee[];
    dueDate: string;
    progress: number;
    status: AssignmentStatus;
  }>;
}
