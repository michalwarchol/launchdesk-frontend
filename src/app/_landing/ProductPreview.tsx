import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import styles from "./ProductPreview.module.scss";

// Demo numbers are internally consistent: 41 + 6 + 3 + 2 = 52 assignments, 79% completed,
// 6 + 3 + 2 = 11 active of which 2 are overdue.
const STATUSES = [
  { key: "statusCompleted", className: "completed", count: 41 },
  { key: "statusInProgress", className: "inProgress", count: 6 },
  { key: "statusNotStarted", className: "notStarted", count: 3 },
  { key: "statusOverdue", className: "overdue", count: 2 },
] as const;

const TOTAL = STATUSES.reduce((sum, s) => sum + s.count, 0);

// Created / completed per month, oldest first. Heights are relative to MAX_ACTIVITY.
const ACTIVITY = [
  [5, 4],
  [8, 6],
  [6, 7],
  [10, 8],
  [9, 9],
  [14, 7],
] as const;
const MAX_ACTIVITY = 14;

const NAV = [
  "dashboard",
  "myTasks",
  "users",
  "documents",
  "tasks",
  "assignments",
  "settings",
] as const;

const DEADLINES = [
  { key: "task1", dayOffset: 3, progress: 80, people: ["AK", "MW", "JD"] },
  { key: "task2", dayOffset: 6, progress: 45, people: ["PN", "JD"] },
  { key: "task3", dayOffset: 11, progress: 15, people: ["MW"] },
] as const;

const RADIUS = 15.915; // circumference of exactly 100 so dash values are percentages
const GAP = 1.5;

/**
 * A CSS and SVG rendition of the real dashboard. Decorative, so hidden from assistive tech, with a
 * fixed aspect ratio that reserves its space before paint.
 */
export default async function ProductPreview() {
  const t = await getTranslations("LandingPage.preview");
  const d = await getTranslations("DashboardPage");
  const nav = await getTranslations("Sidebar");
  const format = await getFormatter();

  const now = new Date();
  const months = ACTIVITY.map((_, i) =>
    format.dateTime(new Date(now.getFullYear(), now.getMonth() - (ACTIVITY.length - 1 - i), 1), {
      month: "short",
    }),
  );
  const dueDate = (offset: number) =>
    format.dateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset), {
      dateStyle: "medium",
    });

  const segments = STATUSES.map((status, index) => {
    const before = STATUSES.slice(0, index).reduce((sum, s) => sum + s.count, 0);
    const length = (status.count / TOTAL) * 100;

    return { ...status, length: Math.max(length - GAP, 0), offset: (before / TOTAL) * 100 };
  });

  return (
    <div className={styles.frame} role="img" aria-label={t("ariaLabel")}>
      <div className={styles.window} aria-hidden="true">
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <Image src="/logo.png" width={32} height={32} alt="" className={styles.mark} />
            <span className={styles.wordmark}>LaunchDesk</span>
          </div>
          <ul className={styles.navList}>
            {NAV.map((item) => (
              <li
                key={item}
                className={`${styles.navItem} ${item === "dashboard" ? styles.navItemActive : ""}`}
              >
                {nav(item)}
              </li>
            ))}
          </ul>
          <div className={styles.user}>
            <span className={styles.avatar}>{t("userName").slice(0, 1)}</span>
            <span className={styles.userText}>
              <span className={styles.userName}>{t("userName")}</span>
              <span className={styles.userEmail}>{t("userEmail")}</span>
            </span>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>{d("title")}</header>

          <div className={styles.content}>
            <div className={styles.kpis}>
              <div className={`${styles.card} ${styles.stat}`}>
                <span className={styles.label}>{d("kpiActiveAssignments")}</span>
                <span className={`${styles.value} ${styles.danger}`}>11</span>
                <span className={styles.hint}>{d("kpiActiveHint", { overdue: 2 })}</span>
              </div>
              <div className={`${styles.card} ${styles.stat}`}>
                <span className={styles.label}>{d("kpiCompletionRate")}</span>
                <span className={`${styles.value} ${styles.success}`}>79%</span>
                <span className={styles.hint}>
                  {d("kpiCompletionHint", { completed: 41, total: TOTAL })}
                </span>
              </div>
              <div className={`${styles.card} ${styles.stat}`}>
                <span className={styles.label}>{d("kpiTaskTemplates")}</span>
                <span className={styles.value}>12</span>
                <span className={styles.hint}>{d("kpiTaskTemplatesHint", { avg: 5 })}</span>
              </div>
              <div className={`${styles.card} ${styles.stat}`}>
                <span className={styles.label}>{d("kpiTeamMembers")}</span>
                <span className={styles.value}>14</span>
                <span className={styles.hint}>
                  {d("kpiTeamMembersHint", { owners: 1, admins: 3, active: 9 })}
                </span>
              </div>
            </div>

            <div className={styles.charts}>
              <div className={styles.card}>
                <span className={styles.cardTitle}>{d("chartStatusTitle")}</span>
                <div className={styles.donutWrap}>
                  <svg viewBox="0 0 42 42" className={styles.donut}>
                    {segments.map((s) => (
                      <circle
                        key={s.key}
                        className={styles[s.className]}
                        cx="21"
                        cy="21"
                        r={RADIUS}
                        fill="none"
                        strokeWidth="5"
                        strokeDasharray={`${s.length} ${100 - s.length}`}
                        strokeDashoffset={25 - s.offset}
                      />
                    ))}
                  </svg>
                  <span className={styles.donutCenter}>
                    <span className={styles.donutTotal}>{TOTAL}</span>
                    <span className={styles.donutCaption}>{d("chartStatusTotal")}</span>
                  </span>
                </div>
                <ul className={styles.legend}>
                  {STATUSES.map((s) => (
                    <li key={s.key} className={styles.legendItem}>
                      <span className={`${styles.dot} ${styles[`bg_${s.className}`]}`} />
                      <span>{d(s.key)}</span>
                      <span className={styles.legendValue}>{s.count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.card}>
                <span className={styles.cardTitle}>{d("chartActivityTitle")}</span>
                <span className={styles.cardDescription}>{d("chartActivityDescription")}</span>
                <div className={styles.bars}>
                  {ACTIVITY.map(([created, completed], i) => (
                    <div key={months[i] + i} className={styles.barGroup}>
                      <div className={styles.barPair}>
                        <span
                          className={`${styles.bar} ${styles.bg_inProgress}`}
                          style={{ height: `${(created / MAX_ACTIVITY) * 100}%` }}
                        />
                        <span
                          className={`${styles.bar} ${styles.bg_completed}`}
                          style={{ height: `${(completed / MAX_ACTIVITY) * 100}%` }}
                        />
                      </div>
                      <span className={styles.month}>{months[i]}</span>
                    </div>
                  ))}
                </div>
                <ul className={styles.legend}>
                  <li className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.bg_inProgress}`} />
                    <span>{d("legendCreated")}</span>
                  </li>
                  <li className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.bg_completed}`} />
                    <span>{d("legendCompleted")}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`${styles.card} ${styles.deadlines}`}>
              <span className={styles.cardTitle}>{d("deadlinesTitle")}</span>
              <div className={`${styles.row} ${styles.rowHead}`}>
                <span>{d("columnTask")}</span>
                <span>{d("columnAssignees")}</span>
                <span>{d("columnDueDate")}</span>
                <span>{d("columnProgress")}</span>
              </div>
              {DEADLINES.map((row) => (
                <div key={row.key} className={styles.row}>
                  <span className={styles.taskName}>{t(row.key)}</span>
                  <span className={styles.people}>
                    {row.people.map((p) => (
                      <span key={p} className={styles.person}>
                        {p}
                      </span>
                    ))}
                  </span>
                  <span className={styles.date}>{dueDate(row.dayOffset)}</span>
                  <span className={styles.progress}>
                    <span className={styles.progressFill} style={{ width: `${row.progress}%` }} />
                    <span className={styles.progressLabel}>{row.progress}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
