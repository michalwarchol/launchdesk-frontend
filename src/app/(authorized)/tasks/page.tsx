"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Table, { Column } from "@/components/Table";
import Topbar from "@/components/Topbar";

// TODO: Replace with actual data from the API
import mockData from "./mockData";
import { Task } from "./types";

export default function Tasks() {
  const t = useTranslations("TasksPage");
  const router = useRouter();

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
      <Table
        data={mockData}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/tasks/${row.id}`)}
        emptyMessage={t("empty")}
      />
    </div>
  );
}
