"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import {
  useAssignmentQuery,
  useDeleteAssignmentMutation,
} from "@/app/(authorized)/assignments/api";
import Accordion, { AccordionItemData } from "@/components/Accordion";
import Alert from "@/components/Alert";
import AvatarGroup from "@/components/AvatarGroup";
import Button from "@/components/Button";
import Card from "@/components/Card";
import LoadingStatus from "@/components/LoadingStatus";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import { isRichTextEmpty } from "@/components/RichTextEditor/isRichTextEmpty";
import richTextStyles from "@/components/RichTextEditor/RichTextEditor.module.scss";
import { isApiError } from "@/lib/api/errors";
import { deriveAssignmentStatus } from "@/utils/assignmentStatus";
import { parseISODate } from "@/utils/isoDate";
import { shiftHeadingLevels } from "@/utils/shiftHeadingLevels";

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
  const tCommon = useTranslations("Common");
  const tAssignments = useTranslations("AssignmentsPage");
  const tProgress = useTranslations("ProgressBar");
  const format = useFormatter();
  const router = useRouter();
  const { data: assignment, isPending, error } = useAssignmentQuery(assignmentId);
  const deleteAssignment = useDeleteAssignmentMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<DeleteAssignmentError>();
  const [expandedAssigneeIds, setExpandedAssigneeIds] = useState<string[]>([]);

  if (isPending) {
    return (
      <div className={styles.page}>
        <PageHeader title={tCommon("loading")} backHref="/assignments" />
        <LoadingStatus />
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

  const assigneeNoteItems: AccordionItemData[] = assignment.assignees
    .filter((assignee) => assignee.stepNotes && assignee.stepNotes.length > 0)
    .map((assignee) => ({
      id: assignee.id,
      header: (
        <div className={styles.assigneeNotesHeader}>
          <span className={styles.assigneeNotesName}>
            {assignee.firstName} {assignee.lastName}
          </span>
          <ProgressBar
            value={assignee.progress}
            label={tProgress("progressOf", {
              name: `${assignee.firstName} ${assignee.lastName}`,
            })}
            className={styles.assigneeNotesProgress}
          />
        </div>
      ),
      content: (
        <ol className={styles.assigneeNotesSteps}>
          {assignee.stepNotes!.map((stepNote, index) => (
            <li key={stepNote.stepId} className={styles.assigneeNotesStep}>
              <h3 className={styles.assigneeNotesStepTitle}>
                <span className={styles.assigneeNotesStepIndex}>{index + 1}</span>
                {stepNote.stepName}
              </h3>
              {isRichTextEmpty(stepNote.notes) ? (
                <p className={styles.assigneeNotesEmpty}>{t("notesEmpty")}</p>
              ) : (
                <div className={richTextStyles.editor}>
                  <div className={richTextStyles.content}>
                    <div
                      className="ProseMirror"
                      dangerouslySetInnerHTML={{
                        __html: shiftHeadingLevels(stepNote.notes, 4),
                      }}
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      ),
    }));

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
        <dl className={styles.detailsGrid}>
          <div>
            <dt className={styles.fieldLabel}>{tAssignments("columnTask")}</dt>
            <dd className={styles.fieldValue}>{assignment.taskName}</dd>
          </div>
          <div>
            <dt className={styles.fieldLabel}>{t("statusLabel")}</dt>
            <dd className={styles.fieldValue}>{tAssignments(`status.${status}`)}</dd>
          </div>
          <div>
            <dt className={styles.fieldLabel}>{tAssignments("columnDueDate")}</dt>
            <dd className={styles.fieldValue}>{formatDate(assignment.dueDate)}</dd>
          </div>
          <div>
            <dt className={styles.fieldLabel}>{t("createdAtLabel")}</dt>
            <dd className={styles.fieldValue}>{formatDate(assignment.createdAt)}</dd>
          </div>
          {assignment.completedAt ? (
            <div>
              <dt className={styles.fieldLabel}>{t("completedAtLabel")}</dt>
              <dd className={styles.fieldValue}>{formatDate(assignment.completedAt)}</dd>
            </div>
          ) : null}
          <div style={{ gridColumn: "1 / -1" }}>
            <dt className={styles.fieldLabel}>{tAssignments("columnProgress")}</dt>
            <dd className={styles.fieldValue}>
              <ProgressBar
                value={assignment.progress}
                label={tProgress("progressOf", { name: assignment.taskName })}
              />
            </dd>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <dt className={styles.fieldLabel}>{tAssignments("columnAssignees")}</dt>
            <dd className={styles.assigneesValue}>
              <AvatarGroup
                decorative
                items={assignment.assignees.map((assignee) => ({
                  id: assignee.id,
                  name: `${assignee.firstName} ${assignee.lastName}`,
                  src: assignee.avatar,
                }))}
              />
              <p className={styles.assigneeNames}>{assigneeNames}</p>
            </dd>
          </div>
        </dl>
      </Card>

      {assigneeNoteItems.length > 0 ? (
        <Card title={t("assigneeNotesTitle")}>
          <Accordion
            items={assigneeNoteItems}
            expandedIds={expandedAssigneeIds}
            onExpandedChange={setExpandedAssigneeIds}
            allowMultiple
          />
        </Card>
      ) : null}

      {isDeleteOpen ? (
        <Modal
          isOpen
          onClose={closeDeleteModal}
          title={t("deleteModalTitle")}
          submitLabel={deleteAssignment.isPending ? t("deleteSubmitting") : t("deleteConfirm")}
          onSubmit={() => void confirmDelete()}
          isSubmitDisabled={deleteAssignment.isPending}
        >
          {deleteError ? <Alert variant="error">{t(`deleteErrors.${deleteError}`)}</Alert> : null}
          <p>{t("deleteModalBody", { task: assignment.taskName })}</p>
        </Modal>
      ) : null}
    </div>
  );
}
