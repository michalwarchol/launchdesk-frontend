"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useDeleteTaskMutation, useTaskQuery } from "@/app/(authorized)/tasks/api";
import Accordion, { AccordionItemData } from "@/components/Accordion";
import Alert from "@/components/Alert";
import AttachmentsField from "@/components/AttachmentsField";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import richTextStyles from "@/components/RichTextEditor/RichTextEditor.module.scss";
import { isApiError } from "@/lib/api/errors";

import formStyles from "../new/NewTaskForm.module.scss";
import stepStyles from "../new/TaskStepsField.module.scss";
import pageStyles from "../taskDetail.module.scss";

type DeleteTaskError = "forbidden" | "generic";

function toDeleteTaskError(error: unknown): DeleteTaskError {
  if (isApiError(error) && error.status === 403) {
    return "forbidden";
  }

  return "generic";
}

interface TaskDetailsViewProps {
  taskId: string;
  canManage: boolean;
}

export default function TaskDetailsView({ taskId, canManage }: TaskDetailsViewProps) {
  const t = useTranslations("TaskDetailsPage");
  const tNew = useTranslations("NewTaskPage");
  const router = useRouter();
  const { data: task, isPending, error } = useTaskQuery(taskId);
  const deleteTask = useDeleteTaskMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<DeleteTaskError>();
  const [expandedIds, setExpandedIds] = useState<string[] | null>(null);

  if (isPending) {
    return (
      <div className={pageStyles.page}>
        <PageHeader title="…" backHref="/tasks" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className={pageStyles.page}>
        <PageHeader title={t("notFound")} backHref="/tasks" />
        <Alert variant="error">{error ? t("loadError") : t("notFound")}</Alert>
      </div>
    );
  }

  const closeDeleteModal = () => {
    if (deleteTask.isPending) return;
    setIsDeleteOpen(false);
    setDeleteError(undefined);
  };

  const confirmDelete = async () => {
    setDeleteError(undefined);

    try {
      await deleteTask.mutateAsync(taskId);
    } catch (err) {
      setDeleteError(toDeleteTaskError(err));

      return;
    }

    router.push("/tasks");
  };

  const stepItems: AccordionItemData[] = task.steps.map((step, index) => ({
    id: step.id,
    header: (
      <span className={stepStyles.stepHeader}>
        <span className={stepStyles.stepIndex}>{index + 1}</span>
        <span className={stepStyles.stepTitle}>{step.name}</span>
      </span>
    ),
    content: (
      <div className={stepStyles.stepContent}>
        <div className={stepStyles.stepField}>
          <span className={stepStyles.stepFieldLabel}>{tNew("stepDescriptionLabel")}</span>
          <div className={richTextStyles.editor}>
            <div className={richTextStyles.content}>
              <div
                className="ProseMirror"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />
            </div>
          </div>
        </div>

        {step.attachments.length > 0 ? (
          <div className={stepStyles.stepField}>
            <span className={stepStyles.stepFieldLabel}>{tNew("stepAttachmentsLabel")}</span>
            <AttachmentsField
              value={step.attachments.map((document) => ({
                kind: "document",
                id: document.id,
                name: document.name,
                size: document.size,
                extension: document.extension,
                documentType: document.type,
              }))}
              onChange={() => {}}
              disabled
            />
          </div>
        ) : null}
      </div>
    ),
  }));

  return (
    <div className={pageStyles.page}>
      <PageHeader title={task.name} backHref="/tasks">
        {canManage ? (
          <div className={pageStyles.headerActions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/tasks/${taskId}/edit`)}
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

      <div className={formStyles.body}>
        <div>
          <p className={pageStyles.fieldLabel}>{tNew("descriptionLabel")}</p>
          <p className={pageStyles.fieldValue}>{task.description}</p>
        </div>

        <div className={stepStyles.wrapper}>
          <div className={stepStyles.sectionHeader}>
            <span className={stepStyles.sectionTitle}>{tNew("stepsTitle")}</span>
          </div>
          <Accordion
            items={stepItems}
            expandedIds={expandedIds ?? task.steps.map((step) => step.id)}
            onExpandedChange={setExpandedIds}
          />
        </div>
      </div>

      {isDeleteOpen ? (
        <Modal
          isOpen
          onClose={closeDeleteModal}
          title={t("deleteModalTitle")}
          submitLabel={deleteTask.isPending ? t("deleteSubmitting") : t("deleteConfirm")}
          onSubmit={() => void confirmDelete()}
          isSubmitDisabled={deleteTask.isPending}
        >
          {deleteError ? <Alert variant="error">{t(`deleteErrors.${deleteError}`)}</Alert> : null}
          <p>{t("deleteModalBody", { name: task.name })}</p>
        </Modal>
      ) : null}
    </div>
  );
}
