"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import AssignmentCard from "@/components/AssignmentCard";
import { useTableParams } from "@/components/Table";
import Pagination from "@/components/Table/Pagination";
import TextField from "@/components/TextField";
import Topbar from "@/components/Topbar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { parseISODate } from "@/utils/isoDate";

import { useMyTasksQuery } from "./api";
import styles from "./page.module.scss";

import type { MyAssignment } from "@/lib/api/types";

export default function MyTasksPage() {
  const t = useTranslations("MyTasksPage");
  const format = useFormatter();
  const { page, pageSize, setPage, filterValues, setFilter } = useTableParams();
  const searchFromUrl = filterValues.search ?? "";
  const [searchDraft, setSearchDraft] = useState(searchFromUrl);
  const [trackedSearchFromUrl, setTrackedSearchFromUrl] = useState(searchFromUrl);

  if (searchFromUrl !== trackedSearchFromUrl) {
    setTrackedSearchFromUrl(searchFromUrl);
    setSearchDraft(searchFromUrl);
  }

  const debouncedSearch = useDebouncedValue(searchDraft, 2000);
  const trimmedSearch = searchFromUrl.trim();

  useEffect(() => {
    const next = debouncedSearch.trim();

    if (next !== trimmedSearch) {
      setFilter("search", next);
    }
  }, [debouncedSearch, trimmedSearch, setFilter]);

  const { data, isPending, isFetching, error } = useMyTasksQuery({
    page,
    pageSize,
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
  });

  const formatDueDate = (dueDate: string) => {
    const parsed = parseISODate(dueDate);

    return parsed ? format.dateTime(parsed, { dateStyle: "medium" }) : dueDate;
  };

  const groups = (data?.data ?? []).reduce<
    { status: MyAssignment["status"]; items: MyAssignment[] }[]
  >((acc, assignment) => {
    const last = acc[acc.length - 1];

    if (last && last.status === assignment.status) last.items.push(assignment);
    else acc.push({ status: assignment.status, items: [assignment] });

    return acc;
  }, []);

  const showPagination = Boolean(data && !error && data.meta.total > data.meta.pageSize);

  return (
    <div>
      <Topbar title={t("title")} />
      <div className={styles.searchRow}>
        <TextField
          id="my-tasks-search"
          size="sm"
          placeholder={t("searchPlaceholder")}
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
        />
      </div>
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
        groups.map((group) => (
          <section key={group.status} className={styles.group}>
            <h2 className={styles.groupTitle}>{t(`groups.${group.status}`)}</h2>
            <ul className={styles.list}>
              {group.items.map((assignment) => (
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
          </section>
        ))
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
