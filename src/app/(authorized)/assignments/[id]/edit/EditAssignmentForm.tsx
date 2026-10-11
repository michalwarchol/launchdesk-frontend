"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  useAssignmentQuery,
  useUpdateAssignmentMutation,
} from "@/app/(authorized)/assignments/api";
import { useUsersQuery } from "@/app/(authorized)/users/api";
import Alert from "@/components/Alert";
import Autocomplete from "@/components/Autocomplete";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import { isApiError } from "@/lib/api/errors";

import styles from "./EditAssignmentForm.module.scss";
import {
  AssigneeOption,
  EditAssignmentFormValues,
  editAssignmentSchema,
} from "./schema";

import type { AssignmentAssignee } from "@/lib/api/types";

type SaveAssignmentError = "forbidden" | "generic";

function toSaveAssignmentError(error: unknown): SaveAssignmentError {
  if (isApiError(error) && error.status === 403) {
    return "forbidden";
  }

  return "generic";
}

function toAssigneeOptions(assignees: AssignmentAssignee[]): AssigneeOption[] {
  return assignees.map((assignee) => ({
    id: assignee.id,
    firstName: assignee.firstName,
    lastName: assignee.lastName,
    avatar: assignee.avatar,
  }));
}

function getRemovedAssignees(
  original: AssignmentAssignee[],
  next: AssigneeOption[],
): AssignmentAssignee[] {
  const nextIds = new Set(next.map((assignee) => assignee.id));

  return original.filter((assignee) => !nextIds.has(assignee.id));
}

interface EditAssignmentFormProps {
  assignmentId: string;
}

export default function EditAssignmentForm({ assignmentId }: EditAssignmentFormProps) {
  const t = useTranslations("EditAssignmentPage");
  const tNew = useTranslations("NewAssignmentPage");
  const tAssignments = useTranslations("AssignmentsPage");
  const router = useRouter();
  const { data: assignment, isPending, error } = useAssignmentQuery(assignmentId);
  const updateAssignment = useUpdateAssignmentMutation(assignmentId);
  const [formError, setFormError] = useState<SaveAssignmentError>();
  const [assigneeQuery, setAssigneeQuery] = useState("");
  const [pendingValues, setPendingValues] = useState<EditAssignmentFormValues | null>(null);
  const [removedAssignees, setRemovedAssignees] = useState<AssignmentAssignee[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditAssignmentFormValues>({
    resolver: zodResolver(editAssignmentSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      assignees: [],
      dueDate: null,
    },
  });

  const { data: usersResponse } = useUsersQuery({ pageSize: 100 });

  useEffect(() => {
    if (!assignment) return;

    reset({
      assignees: toAssigneeOptions(assignment.assignees),
      dueDate: assignment.dueDate,
    });
  }, [assignment, reset]);

  const assigneeOptions: AssigneeOption[] = useMemo(
    () =>
      (usersResponse?.data ?? [])
        .filter((user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(assigneeQuery.trim().toLowerCase()),
        )
        .map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
        })),
    [assigneeQuery, usersResponse?.data],
  );

  const errorText = (key?: string) => (key ? tNew(`validation.${key}`) : undefined);

  const saveChanges = async (values: EditAssignmentFormValues) => {
    if (!values.dueDate) return;

    setFormError(undefined);

    try {
      await updateAssignment.mutateAsync({
        dueDate: values.dueDate,
        assigneeIds: values.assignees.map((assignee) => assignee.id),
      });
    } catch (err) {
      setFormError(toSaveAssignmentError(err));

      return;
    }

    router.push(`/assignments/${assignmentId}`);
  };

  const onSubmit = async (values: EditAssignmentFormValues) => {
    if (!assignment || !values.dueDate) return;

    const removed = getRemovedAssignees(assignment.assignees, values.assignees);

    if (assignment.progress > 0 && removed.length > 0) {
      setPendingValues(values);
      setRemovedAssignees(removed);
      return;
    }

    await saveChanges(values);
  };

  const closeConfirmModal = () => {
    if (updateAssignment.isPending) return;
    setPendingValues(null);
    setRemovedAssignees([]);
  };

  const confirmSaveWithRemovedAssignees = async () => {
    if (!pendingValues) return;

    await saveChanges(pendingValues);
    setPendingValues(null);
    setRemovedAssignees([]);
  };

  if (isPending) {
    return (
      <div className={styles.page}>
        <PageHeader title="…" backHref={`/assignments/${assignmentId}`} />
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

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
          backHref={`/assignments/${assignmentId}`}
        />

        <div className={styles.fields}>
          {formError ? <Alert variant="error">{t(`saveErrors.${formError}`)}</Alert> : null}

          <div className={styles.readOnlyField}>
            <span className={styles.fieldLabel}>{tNew("taskLabel")}</span>
            <p className={styles.fieldValue}>{assignment.taskName}</p>
          </div>

          <div className={styles.readOnlyField}>
            <span className={styles.fieldLabel}>{tAssignments("columnProgress")}</span>
            <ProgressBar value={assignment.progress} />
          </div>

          <Controller
            control={control}
            name="assignees"
            render={({ field }) => (
              <Autocomplete<AssigneeOption>
                multiple
                label={tNew("assigneesLabel")}
                placeholder={tNew("assigneesPlaceholder")}
                options={assigneeOptions}
                getOptionLabel={(user) => `${user.firstName} ${user.lastName}`}
                getOptionKey={(user) => user.id}
                inputValue={assigneeQuery}
                onInputValueChange={setAssigneeQuery}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errorText(errors.assignees?.message)}
                renderOption={(user) => (
                  <Avatar
                    src={user.avatar}
                    title={`${user.firstName} ${user.lastName}`}
                    size="sm"
                  />
                )}
                renderValue={(user) => (
                  <>
                    <Avatar
                      src={user.avatar}
                      title={`${user.firstName} ${user.lastName}`}
                      size="sm"
                      hideText
                    />
                    {user.firstName} {user.lastName}
                  </>
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <DatePicker
                label={tNew("dueDateLabel")}
                placeholder={tNew("dueDatePlaceholder")}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errorText(errors.dueDate?.message)}
              />
            )}
          />
        </div>

        <footer className={styles.footer}>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/assignments/${assignmentId}`)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || updateAssignment.isPending}
          >
            {updateAssignment.isPending ? t("saving") : t("save")}
          </Button>
        </footer>
      </form>

      {pendingValues ? (
        <Modal
          isOpen
          onClose={closeConfirmModal}
          title={t("removeStartedAssigneesModalTitle")}
          submitLabel={
            updateAssignment.isPending ? t("saving") : t("removeStartedAssigneesConfirm")
          }
          onSubmit={() => void confirmSaveWithRemovedAssignees()}
          isSubmitDisabled={updateAssignment.isPending}
        >
          <p>{t("removeStartedAssigneesModalBody")}</p>
          <ul className={styles.removedAssigneesList}>
            {removedAssignees.map((assignee) => (
              <li key={assignee.id}>
                {assignee.firstName} {assignee.lastName}
              </li>
            ))}
          </ul>
        </Modal>
      ) : null}
    </div>
  );
}
