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

/** The current user as returned by `/auth/me`, which also knows how the account signs in. */
export interface AuthUser extends User {
  /** `false` for accounts that only ever signed in with Google or GitHub. */
  hasPassword: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
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

export interface StatusBreakdownItem {
  status: AssignmentStatus;
  count: number;
}

export interface MonthlyActivityItem {
  monthKey: string;
  monthLabel: string;
  created: number;
  completed: number;
}

export interface TopTaskItem {
  taskId: string;
  taskName: string;
  count: number;
}

export interface WorkloadItem {
  userId: string;
  name: string;
  avatar?: string;
  count: number;
}

export interface UpcomingDeadlineItem {
  id: string;
  taskId: string;
  taskName: string;
  assignees: AssignmentAssignee[];
  dueDate: string;
  progress: number;
  status: AssignmentStatus;
}

export interface DashboardStats {
  totals: {
    assignments: number;
    completed: number;
    overdue: number;
    active: number;
    notStarted: number;
    /** A rounded percentage between 0 and 100. */
    completionRate: number;
    tasks: number;
    averageStepsPerTask: number;
    users: number;
    admins: number;
    usersWithActiveWork: number;
  };
  statusBreakdown: StatusBreakdownItem[];
  monthlyActivity: MonthlyActivityItem[];
  topTasks: TopTaskItem[];
  workload: WorkloadItem[];
  upcomingDeadlines: UpcomingDeadlineItem[];
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export interface CreateAssignmentInput {
  taskId: string;
  assigneeIds: string[];
  /** An ISO date, `YYYY-MM-DD`. */
  dueDate: string;
}

export interface CreateTaskStepInput {
  name: string;
  description: string;
  attachmentIds: string[];
}

export interface CreateTaskInput {
  name: string;
  description: string;
  steps: CreateTaskStepInput[];
}
