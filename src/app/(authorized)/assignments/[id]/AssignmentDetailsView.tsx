"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import {
  useAssignmentQuery,
  useDeleteAssignmentMutation,
} from "@/app/(authorized)/assignments/api";
import Alert from "@/components/Alert";
import AvatarGroup from "@/components/AvatarGroup";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import { isApiError } from "@/lib/api/errors";
import { deriveAssignmentStatus } from "@/utils/assignmentStatus";
import { parseISODate } from "@/utils/isoDate";

import styles from "../assignmentDetail.module.scss";

type DeleteAssignmentError = "forbidden" | "generic";

function toDeleteAssignmentError(error: unknown): DeleteAssignmentError {
  if (isApiError(error) && error.status === 403) {
    return "forbidden";
  }

  return "generic";
}

interface AssignmentDetailsViewProps {
  assignmentId: string;
  canManage: boolean;
}

export default function AssignmentDetailsView({
  assignmentId,
  canManage,
}: AssignmentDetailsViewProps) {
  const t = useTranslations("AssignmentDetailsPage");
  const tAssignments = useTranslations("AssignmentsPage");
  const format = useFormatter();
  const router = useRouter();
  const { data: assignment, isPending, error } = useAssignmentQuery(assignmentId);
  const deleteAssignment = useDeleteAssignmentMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<DeleteAssignmentError>();

  if (isPending) {
    return (
      <div className={styles.page}>
        <PageHeader title="…" backHref="/assignments" />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className={styles.page}>
        <PageHeader title={t("notFound")} backHref="/assignments" />
        <Alert variant="error">{error ? t("loadError") : t("notFound")}</Alert>
      </div>
    );
  }

  const formatDate = (value: string) => {
    const parsed = parseISODate(value);

    return parsed ? format.dateTime(parsed, { dateStyle: "medium" }) : value;
  };

  const status = deriveAssignmentStatus(assignment.progress, assignment.dueDate);
  const assigneeNames = assignment.assignees
    .map((assignee) => `${assignee.firstName} ${assignee.lastName}`)
    .join(", ");

  const closeDeleteModal = () => {
    if (deleteAssignment.isPending) return;
    setIsDeleteOpen(false);
    setDeleteError(undefined);
  };

  const confirmDelete = async () => {
    setDeleteError(undefined);

    try {
      await deleteAssignment.mutateAsync(assignmentId);
    } catch (err) {
      setDeleteError(toDeleteAssignmentError(err));

      return;
    }

    router.push("/assignments");
  };

  return (
    <div className={styles.page}>
      <PageHeader title={assignment.taskName} backHref="/assignments">
        {canManage ? (
          <div className={styles.headerActions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/assignments/${assignmentId}/edit`)}
            >
              {t("edit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteError(undefined);
                setIsDeleteOpen(true);
              }}
            >
              {t("delete")}
            </Button>
          </div>
        ) : null}
      </PageHeader>

      <Card title={t("detailsTitle")}>
        <div className={styles.detailsGrid}>
          <div>
            <p className={styles.fieldLabel}>{tAssignments("columnTask")}</p>
            <p className={styles.fieldValue}>{assignment.taskName}</p>
          </div>
          <div>
            <p className={styles.fieldLabel}>{t("statusLabel")}</p>
            <p className={styles.fieldValue}>{tAssignments(`status.${status}`)}</p>
          </div>
          <div>
            <p className={styles.fieldLabel}>{tAssignments("columnDueDate")}</p>
            <p className={styles.fieldValue}>{formatDate(assignment.dueDate)}</p>
          </div>
          <div>
            <p className={styles.fieldLabel}>{t("createdAtLabel")}</p>
            <p className={styles.fieldValue}>{formatDate(assignment.createdAt)}</p>
          </div>
          {assignment.completedAt ? (
            <div>
              <p className={styles.fieldLabel}>{t("completedAtLabel")}</p>
              <p className={styles.fieldValue}>{formatDate(assignment.completedAt)}</p>
            </div>
          ) : null}
          <div style={{ gridColumn: "1 / -1" }}>
            <p className={styles.fieldLabel}>{tAssignments("columnProgress")}</p>
            <ProgressBar value={assignment.progress} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <p className={styles.fieldLabel}>{tAssignments("columnAssignees")}</p>
            <div className={styles.assigneesValue}>
              <AvatarGroup
                items={assignment.assignees.map((assignee) => ({
                  id: assignee.id,
                  name: `${assignee.firstName} ${assignee.lastName}`,
                  src: assignee.avatar,
                }))}
              />
              <p className={styles.assigneeNames}>{assigneeNames}</p>
            </div>
          </div>
        </div>
      </Card>

      {isDeleteOpen ? (
        <Modal
          isOpen
          onClose={closeDeleteModal}
          title={t("deleteModalTitle")}
          submitLabel={
            deleteAssignment.isPending ? t("deleteSubmitting") : t("deleteConfirm")
          }
          onSubmit={() => void confirmDelete()}
          isSubmitDisabled={deleteAssignment.isPending}
        >
          {deleteError ? (
            <Alert variant="error">{t(`deleteErrors.${deleteError}`)}</Alert>
          ) : null}
          <p>{t("deleteModalBody", { task: assignment.taskName })}</p>
        </Modal>
      ) : null}
    </div>
  );
}
