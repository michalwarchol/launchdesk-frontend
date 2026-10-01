"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Alert from "@/components/Alert";
import Table, { Column } from "@/components/Table";
import Topbar from "@/components/Topbar";

import { useTasksQuery } from "./api";
import { Task } from "./types";

export default function Tasks() {
  const t = useTranslations("TasksPage");
  const router = useRouter();
  const { data, isPending, error } = useTasksQuery();

  const columns: Column<Task>[] = [
    { key: "name", header: t("columnName") },
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
      {isPending ? <p>{t("loading")}</p> : null}
      {error ? <Alert>{t("loadError")}</Alert> : null}
      {!isPending && !error ? (
        <Table
          data={data?.data ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(row) => router.push(`/tasks/${row.id}`)}
          emptyMessage={t("empty")}
        />
      ) : null}
    </div>
  );
}
