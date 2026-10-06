"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Table, { Column, useTableQueryParams } from "@/components/Table";
import Topbar from "@/components/Topbar";

import { useTasksQuery } from "./api";
import { Task } from "./types";

export default function Tasks() {
  const t = useTranslations("TasksPage");
  const router = useRouter();
  const { params, getTableProps } = useTableQueryParams();
  const { data, isPending, error } = useTasksQuery(params);

  const columns: Column<Task>[] = [
    { key: "name", header: t("columnName"), sortable: true },
    { key: "description", header: t("columnDescription") },
    { key: "stepsCount", header: t("columnStepsCount"), align: "right" },
  ];

  return (
    <div>
      <Topbar
        title={t("title")}
        onPrimaryClick={() => router.push("/tasks/new")}
        primaryButtonLabel={t("addTask")}
      />
      <Table
        {...getTableProps(data?.meta.total)}
        data={data?.data ?? []}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/tasks/${row.id}`)}
        emptyMessage={t("empty")}
        isLoading={isPending}
        error={error ? t("loadError") : undefined}
      />
    </div>
  );
}
