import { getTranslations } from "next-intl/server";

import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import Topbar from "@/components/Topbar";

import AssignmentActivityChart from "./charts/AssignmentActivityChart";
import AssignmentStatusChart from "./charts/AssignmentStatusChart";
import TeamWorkloadChart from "./charts/TeamWorkloadChart";
import TopTasksChart from "./charts/TopTasksChart";
import { getDashboardStats } from "./mockData";
import styles from "./page.module.scss";
import { AssignmentStatus } from "./types";
import UpcomingDeadlines from "./UpcomingDeadlines";

export default async function DashboardPage() {
  const t = await getTranslations("DashboardPage");
  const stats = await getDashboardStats();

  const statusLabels: Record<AssignmentStatus, string> = {
    completed: t("statusCompleted"),
    overdue: t("statusOverdue"),
    inProgress: t("statusInProgress"),
    notStarted: t("statusNotStarted"),
  };

  const activeHint =
    stats.totals.overdue > 0
      ? t("kpiActiveHint", { overdue: stats.totals.overdue })
      : t("kpiActiveHintNone");

  return (
    <div>
      <Topbar title={t("title")} />
      <section className={styles.kpis}>
        <StatCard
          label={t("kpiActiveAssignments")}
          value={`${stats.totals.active}`}
          hint={activeHint}
          tone={stats.totals.overdue > 0 ? "danger" : "default"}
        />
        <StatCard
          label={t("kpiCompletionRate")}
          value={`${stats.totals.completionRate}%`}
          hint={t("kpiCompletionHint", {
            completed: stats.totals.completed,
            total: stats.totals.assignments,
          })}
          tone="success"
        />
        <StatCard
          label={t("kpiTaskTemplates")}
          value={`${stats.totals.tasks}`}
          hint={t("kpiTaskTemplatesHint", { avg: stats.totals.averageStepsPerTask })}
        />
        <StatCard
          label={t("kpiTeamMembers")}
          value={`${stats.totals.users}`}
          hint={t("kpiTeamMembersHint", {
            admins: stats.totals.admins,
            active: stats.totals.usersWithActiveWork,
          })}
        />
      </section>
      <section className={styles.charts}>
        <Card title={t("chartStatusTitle")}>
          <AssignmentStatusChart
            data={stats.statusBreakdown}
            labels={statusLabels}
            totalLabel={t("chartStatusTotal")}
            total={stats.totals.assignments}
          />
        </Card>
        <Card title={t("chartActivityTitle")} description={t("chartActivityDescription")}>
          <AssignmentActivityChart
            data={stats.monthlyActivity}
            createdLabel={t("legendCreated")}
            completedLabel={t("legendCompleted")}
          />
        </Card>
        <Card title={t("chartTopTasksTitle")}>
          <TopTasksChart data={stats.topTasks} countLabel={t("legendCount")} />
        </Card>
        <Card title={t("chartWorkloadTitle")} description={t("chartWorkloadDescription")}>
          <TeamWorkloadChart data={stats.workload} countLabel={t("legendActiveCount")} />
        </Card>
      </section>
      <section className={styles.deadlines}>
        <Card title={t("deadlinesTitle")}>
          <UpcomingDeadlines
            data={stats.upcomingDeadlines}
            columnTask={t("columnTask")}
            columnAssignees={t("columnAssignees")}
            columnDueDate={t("columnDueDate")}
            columnProgress={t("columnProgress")}
            emptyMessage={t("deadlinesEmpty")}
          />
        </Card>
      </section>
    </div>
  );
}
