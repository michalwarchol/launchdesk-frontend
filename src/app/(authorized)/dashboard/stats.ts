import { Assignment } from "@/app/(authorized)/assignments/types";
import { User } from "@/app/(authorized)/users/types";
import { toISODate } from "@/utils/isoDate";

import {
  AssignmentStatus,
  DashboardInput,
  DashboardStats,
  MonthlyActivityItem,
  StatusBreakdownItem,
  TopTaskItem,
  UpcomingDeadlineItem,
  WorkloadItem,
} from "./types";

const STATUS_ORDER: AssignmentStatus[] = ["completed", "overdue", "inProgress", "notStarted"];

/** Classify an assignment given its progress and due date relative to `todayIso`. */
export function deriveStatus(assignment: Assignment, todayIso: string): AssignmentStatus {
  if (assignment.progress >= 1) return "completed";
  if (assignment.dueDate < todayIso) return "overdue";
  if (assignment.progress > 0) return "inProgress";

  return "notStarted";
}

function monthKeyOf(isoDate: string): string {
  return isoDate.slice(0, 7);
}

function firstOfMonth(monthKey: string): Date {
  const [year, month] = monthKey.split("-").map(Number);

  return new Date(year, month - 1, 1);
}

export function buildStatusBreakdown(
  assignments: Assignment[],
  todayIso: string,
): StatusBreakdownItem[] {
  const counts: Record<AssignmentStatus, number> = {
    completed: 0,
    overdue: 0,
    inProgress: 0,
    notStarted: 0,
  };

  for (const assignment of assignments) {
    counts[deriveStatus(assignment, todayIso)] += 1;
  }

  return STATUS_ORDER.map((status) => ({ status, count: counts[status] }));
}

export function buildMonthlyActivity(
  input: DashboardInput,
  now: Date,
  formatMonthLabel: (date: Date) => string,
): MonthlyActivityItem[] {
  const monthKeys: string[] = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const first = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    monthKeys.push(monthKeyOf(toISODate(first)));
  }

  return monthKeys.map((monthKey) => {
    let created = 0;
    let completed = 0;

    for (const assignment of input.assignments) {
      if (monthKeyOf(assignment.createdAt) === monthKey) created += 1;
      if (
        assignment.progress >= 1 &&
        assignment.completedAt &&
        monthKeyOf(assignment.completedAt) === monthKey
      ) {
        completed += 1;
      }
    }

    return { monthKey, monthLabel: formatMonthLabel(firstOfMonth(monthKey)), created, completed };
  });
}

export function buildTopTasks(assignments: Assignment[], limit = 5): TopTaskItem[] {
  const counts = new Map<string, TopTaskItem>();

  for (const assignment of assignments) {
    const existing = counts.get(assignment.taskId);

    if (existing) {
      existing.count += 1;
    } else {
      counts.set(assignment.taskId, {
        taskId: assignment.taskId,
        taskName: assignment.taskName,
        count: 1,
      });
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

export function buildWorkload(
  assignments: Assignment[],
  users: User[],
  todayIso: string,
  limit = 6,
): WorkloadItem[] {
  const counts = new Map<string, number>();

  for (const assignment of assignments) {
    if (deriveStatus(assignment, todayIso) === "completed") continue;

    for (const assignee of assignment.assignees) {
      counts.set(assignee.id, (counts.get(assignee.id) ?? 0) + 1);
    }
  }

  const usersById = new Map(users.map((user) => [user.id, user]));

  return [...counts.entries()]
    .map(([userId, count]) => {
      const user = usersById.get(userId);

      return {
        userId,
        name: user ? `${user.firstName} ${user.lastName}` : `${userId}`,
        avatar: user?.avatar,
        count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function buildUpcomingDeadlines(
  assignments: Assignment[],
  todayIso: string,
  limit = 6,
): UpcomingDeadlineItem[] {
  return assignments
    .filter((assignment) => deriveStatus(assignment, todayIso) !== "completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, limit)
    .map((assignment) => ({
      id: assignment.id,
      taskId: assignment.taskId,
      taskName: assignment.taskName,
      assignees: assignment.assignees,
      dueDate: assignment.dueDate,
      progress: assignment.progress,
      status: deriveStatus(assignment, todayIso),
    }));
}

export function buildDashboardStats(
  input: DashboardInput,
  now: Date,
  formatMonthLabel: (date: Date) => string,
): DashboardStats {
  const todayIso = toISODate(now);
  const { assignments, tasks, users } = input;

  const statusBreakdown = buildStatusBreakdown(assignments, todayIso);
  const byStatus = new Map(statusBreakdown.map((item) => [item.status, item.count]));
  const completed = byStatus.get("completed") ?? 0;
  const overdue = byStatus.get("overdue") ?? 0;
  const inProgress = byStatus.get("inProgress") ?? 0;
  const notStarted = byStatus.get("notStarted") ?? 0;
  const active = inProgress + overdue + notStarted;
  const totalAssignments = assignments.length;
  const completionRate =
    totalAssignments > 0 ? Math.round((completed / totalAssignments) * 100) : 0;

  const totalSteps = tasks.reduce((sum, task) => sum + task.stepsCount, 0);
  const averageStepsPerTask =
    tasks.length > 0 ? Math.round((totalSteps / tasks.length) * 10) / 10 : 0;

  const admins = users.filter((user) => user.role === "admin").length;
  const usersWithActiveWork = new Set<number>();

  for (const assignment of assignments) {
    if (deriveStatus(assignment, todayIso) === "completed") continue;
    for (const assignee of assignment.assignees) {
      const user = users.find((entry) => entry.id === assignee.id);

      if (user) usersWithActiveWork.add(Number(user.id));
    }
  }

  return {
    totals: {
      assignments: totalAssignments,
      completed,
      overdue,
      active,
      notStarted,
      completionRate,
      tasks: tasks.length,
      averageStepsPerTask,
      users: users.length,
      admins,
      usersWithActiveWork: usersWithActiveWork.size,
    },
    statusBreakdown,
    monthlyActivity: buildMonthlyActivity(input, now, formatMonthLabel),
    topTasks: buildTopTasks(assignments),
    workload: buildWorkload(assignments, users, todayIso),
    upcomingDeadlines: buildUpcomingDeadlines(assignments, todayIso),
  };
}
