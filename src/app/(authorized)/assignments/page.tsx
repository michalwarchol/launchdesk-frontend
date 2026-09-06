"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import AvatarGroup from "@/components/AvatarGroup";
import ProgressBar from "@/components/ProgressBar";
import Table, { Column } from "@/components/Table";
import Topbar from "@/components/Topbar";

// TODO: Replace with actual data from the API
import mockData from "./mockData";
import { Assignment } from "./types";

export default function Assignments() {
  const t = useTranslations("AssignmentsPage");
  const router = useRouter();

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
      key: "progress",
      header: t("columnProgress"),
      width: "220px",
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
        data={mockData}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/assignments/${row.id}`)}
        emptyMessage={t("empty")}
      />
    </div>
  );
}
