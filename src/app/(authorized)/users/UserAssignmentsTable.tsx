"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useAssignmentsQuery, useUnassignUserFromAssignmentMutation } from "@/app/(authorized)/assignments/api";
import {
  Assignment,
  AssignmentQueryParams,
  AssignmentStatus,
} from "@/app/(authorized)/assignments/types";
import Alert from "@/components/Alert";
import AvatarGroup from "@/components/AvatarGroup";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import ProgressBar from "@/components/ProgressBar";
import Table, { Column, FilterConfig, useTableQueryParams } from "@/components/Table";
import { isApiError } from "@/lib/api/errors";
import { parseISODate } from "@/utils/isoDate";

const STATUSES: AssignmentStatus[] = ["notStarted", "inProgress", "overdue", "completed"];
const FILTER_KEYS = ["status"] as const;

interface UserAssignmentsTableProps {
  userId: string;
  userDisplayName: string;
  showUnassign?: boolean;
  sectionTitle: string;
  emptyMessage: string;
  loadErrorMessage: string;
}

type UnassignError = "forbidden" | "generic";

function toUnassignError(error: unknown): UnassignError {
  if (isApiError(error) && error.status === 403) {
    return "forbidden";
  }

  return "generic";
}

export default function UserAssignmentsTable({
  userId,
  userDisplayName,
  showUnassign = false,
  sectionTitle,
  emptyMessage,
  loadErrorMessage,
}: UserAssignmentsTableProps) {
  const tAssignments = useTranslations("AssignmentsPage");
  const tEdit = useTranslations("EditUserPage");
  const format = useFormatter();
  const { params, getTableProps } = useTableQueryParams(FILTER_KEYS);
  const queryParams = useMemo(
    () => ({ ...params, assigneeId: userId }) as AssignmentQueryParams,
    [params, userId],
  );
  const { data, isPending, error } = useAssignmentsQuery(queryParams);
  const unassignMutation = useUnassignUserFromAssignmentMutation();

  const [pendingUnassign, setPendingUnassign] = useState<Assignment | null>(null);
  const [unassignError, setUnassignError] = useState<UnassignError>();

  const filters: FilterConfig[] = [
    {
      key: "status",
      label: tAssignments("filterStatus"),
      type: "select",
      options: STATUSES.map((status) => ({
        value: status,
        label: tAssignments(`status.${status}`),
      })),
    },
  ];

  const formatDueDate = (dueDate: string) => {
    const parsed = parseISODate(dueDate);

    return parsed ? format.dateTime(parsed, { dateStyle: "medium" }) : dueDate;
  };

  const columns: Column<Assignment>[] = [
    { key: "taskName", header: tAssignments("columnTask") },
    {
      key: "assignees",
      header: tAssignments("columnAssignees"),
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
      header: tAssignments("columnDueDate"),
      width: "140px",
      sortable: true,
      render: (row) => <div>{formatDueDate(row.dueDate)}</div>,
    },
    {
      key: "progress",
      header: tAssignments("columnProgress"),
      width: showUnassign ? "180px" : "220px",
      sortable: true,
      render: (row) => <ProgressBar value={row.progress} />,
    },
  ];

  if (showUnassign) {
    columns.push({
      key: "actions",
      header: "",
      width: "140px",
      align: "right",
      render: (row) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setUnassignError(undefined);
            setPendingUnassign(row);
          }}
        >
          {tEdit("unassign")}
        </Button>
      ),
    });
  }

  const closeUnassignModal = () => {
    if (unassignMutation.isPending) return;
    setPendingUnassign(null);
    setUnassignError(undefined);
  };

  const confirmUnassign = async () => {
    if (!pendingUnassign) return;

    setUnassignError(undefined);

    try {
      await unassignMutation.mutateAsync({
        assignmentId: pendingUnassign.id,
        userId,
      });
    } catch (err) {
      setUnassignError(toUnassignError(err));

      return;
    }

    setPendingUnassign(null);
  };

  return (
    <Card title={sectionTitle}>
      <Table
        {...getTableProps(data?.meta.total)}
        filters={filters}
        data={data?.data ?? []}
        columns={columns}
        getRowId={(row) => row.id}
        emptyMessage={emptyMessage}
        isLoading={isPending}
        error={error ? loadErrorMessage : undefined}
      />
      {showUnassign && pendingUnassign ? (
        <Modal
          isOpen
          onClose={closeUnassignModal}
          title={tEdit("unassignModalTitle")}
          submitLabel={
            unassignMutation.isPending ? tEdit("unassignSubmitting") : tEdit("unassignConfirm")
          }
          onSubmit={() => void confirmUnassign()}
          isSubmitDisabled={unassignMutation.isPending}
        >
          {unassignError ? (
            <Alert variant="error">{tEdit(`unassignErrors.${unassignError}`)}</Alert>
          ) : null}
          <p>
            {tEdit("unassignModalBody", {
              name: userDisplayName,
              task: pendingUnassign.taskName,
            })}
          </p>
        </Modal>
      ) : null}
    </Card>
  );
}
