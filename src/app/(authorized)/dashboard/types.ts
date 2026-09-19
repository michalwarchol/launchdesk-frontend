import { Assignment } from "@/app/(authorized)/assignments/types";
import { Task } from "@/app/(authorized)/tasks/types";
import { User } from "@/app/(authorized)/users/types";

export type AssignmentStatus = "completed" | "overdue" | "inProgress" | "notStarted";

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
  assignees: Assignment["assignees"];
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

export interface DashboardInput {
  assignments: Assignment[];
  tasks: Task[];
  users: User[];
}
