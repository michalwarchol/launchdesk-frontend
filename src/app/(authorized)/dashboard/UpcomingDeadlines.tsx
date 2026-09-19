"use client";

import { useRouter } from "next/navigation";
import { useFormatter } from "next-intl";

import AvatarGroup from "@/components/AvatarGroup";
import ProgressBar from "@/components/ProgressBar";
import Table, { Column } from "@/components/Table";
import { parseISODate } from "@/utils/isoDate";

import { UpcomingDeadlineItem } from "./types";

interface UpcomingDeadlinesProps {
  data: UpcomingDeadlineItem[];
  columnTask: string;
  columnAssignees: string;
  columnDueDate: string;
  columnProgress: string;
  emptyMessage: string;
}

export default function UpcomingDeadlines({
  data,
  columnTask,
  columnAssignees,
  columnDueDate,
  columnProgress,
  emptyMessage,
}: UpcomingDeadlinesProps) {
  const format = useFormatter();
  const router = useRouter();

  const formatDueDate = (dueDate: string) => {
    const parsed = parseISODate(dueDate);

    return parsed ? format.dateTime(parsed, { dateStyle: "medium" }) : dueDate;
  };

  const columns: Column<UpcomingDeadlineItem>[] = [
    { key: "taskName", header: columnTask },
    {
      key: "assignees",
      header: columnAssignees,
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
      header: columnDueDate,
      width: "140px",
      render: (row) => <div>{formatDueDate(row.dueDate)}</div>,
    },
    {
      key: "progress",
      header: columnProgress,
      width: "220px",
      render: (row) => <ProgressBar value={row.progress} />,
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      onRowClick={(row) => router.push(`/assignments/${row.id}`)}
      emptyMessage={emptyMessage}
    />
  );
}
