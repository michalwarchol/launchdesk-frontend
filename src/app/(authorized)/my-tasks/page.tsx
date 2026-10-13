"use client";

import { useFormatter, useTranslations } from "next-intl";

import AssignmentCard from "@/components/AssignmentCard";
import { useTableParams } from "@/components/Table";
import Pagination from "@/components/Table/Pagination";
import Topbar from "@/components/Topbar";
import { parseISODate } from "@/utils/isoDate";

import { useMyTasksQuery } from "./api";
import styles from "./page.module.scss";

export default function MyTasksPage() {
  const t = useTranslations("MyTasksPage");
  const format = useFormatter();
  const { page, pageSize, setPage } = useTableParams();
  const { data, isPending, isFetching, error } = useMyTasksQuery({ page, pageSize });

  const formatDueDate = (dueDate: string) => {
    const parsed = parseISODate(dueDate);

    return parsed ? format.dateTime(parsed, { dateStyle: "medium" }) : dueDate;
  };

  const showPagination = Boolean(data && !error && data.meta.total > data.meta.pageSize);

  return (
    <div>
      <Topbar title={t("title")} />
      {error ? (
        <p className={[styles.status, styles.statusError].join(" ")} role="alert">
          {t("loadError")}
        </p>
      ) : isPending ? (
        <div className={styles.status} role="status">
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.visuallyHidden}>{t("loading")}</span>
        </div>
      ) : !data || data.data.length === 0 ? (
        <p className={styles.status}>{t("empty")}</p>
      ) : (
        <ul className={styles.list}>
          {data.data.map((assignment) => (
            <li key={assignment.id}>
              <AssignmentCard
                href={`/my-tasks/${assignment.id}`}
                name={assignment.name}
                description={assignment.description}
                dueDateLabel={t("dueDateLabel")}
                dueDate={formatDueDate(assignment.dueDate)}
              />
            </li>
          ))}
        </ul>
      )}
      {showPagination && data ? (
        <Pagination
          pagination={{
            page: data.meta.page,
            pageSize: data.meta.pageSize,
            total: data.meta.total,
          }}
          onPageChange={setPage}
          disabled={isFetching}
        />
      ) : null}
    </div>
  );
}
