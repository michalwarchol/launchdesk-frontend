"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";

import AvatarGroup from "@/components/AvatarGroup";
import ProgressBar from "@/components/ProgressBar";
import Table, { Column, FilterConfig, useTableQueryParams } from "@/components/Table";
import Topbar from "@/components/Topbar";
import { parseISODate } from "@/utils/isoDate";

import { useAssignmentsQuery } from "./api";
import { Assignment, AssignmentQueryParams, AssignmentStatus } from "./types";

const STATUSES: AssignmentStatus[] = ["notStarted", "inProgress", "overdue", "completed"];
const FILTER_KEYS = ["status"] as const;

export default function Assignments() {
  const t = useTranslations("AssignmentsPage");
  const format = useFormatter();
  const router = useRouter();
  const { params, getTableProps } = useTableQueryParams(FILTER_KEYS);
  const { data, isPending, error } = useAssignmentsQuery(params as AssignmentQueryParams);

  const filters: FilterConfig[] = [
    {
      key: "status",
      label: t("filterStatus"),
      type: "select",
      options: STATUSES.map((status) => ({ value: status, label: t(`status.${status}`) })),
    },
  ];

  const formatDueDate = (dueDate: string) => {
    const parsed = parseISODate(dueDate);

    return parsed ? format.dateTime(parsed, { dateStyle: "medium" }) : dueDate;
  };

  const columns: Column<Assignment>[] = [
    { key: "taskName", header: t("columnTask") },
    {
      key: "assignees",
      header: t("columnAssignees"),
      render: (row) => (
        <AvatarGroup
          items={row.assignees.map((assignee) => ({
            id: assignee.id,
            name: `${assignee.firstName} ${assignee.lastName}`,
            src: assignee.avatar,
          }))}
        />
      ),
    },
    {
      key: "dueDate",
      header: t("columnDueDate"),
      width: "140px",
      sortable: true,
      render: (row) => <div>{formatDueDate(row.dueDate)}</div>,
    },
    {
      key: "progress",
      header: t("columnProgress"),
      width: "220px",
      sortable: true,
      render: (row) => <ProgressBar value={row.progress} />,
    },
  ];

  return (
    <div>
      <Topbar
        title={t("title")}
        onPrimaryClick={() => router.push("/assignments/new")}
        primaryButtonLabel={t("addAssignment")}
      />
      <Table
        {...getTableProps(data?.meta.total)}
        filters={filters}
        data={data?.data ?? []}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/assignments/${row.id}`)}
        emptyMessage={t("empty")}
        isLoading={isPending}
        error={error ? t("loadError") : undefined}
      />
    </div>
  );
}
