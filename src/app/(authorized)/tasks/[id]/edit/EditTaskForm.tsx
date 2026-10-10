"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FormProvider, SubmitErrorHandler, useFieldArray, useForm } from "react-hook-form";

import { useTaskQuery, useUpdateTaskMutation } from "@/app/(authorized)/tasks/api";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import TextField from "@/components/TextField";
import { isApiError } from "@/lib/api/errors";

import styles from "../../new/NewTaskForm.module.scss";
import { NewTaskFormValues, newTaskSchema } from "../../new/schema";
import TaskStepsField from "../../new/TaskStepsField";
import pageStyles from "../../taskDetail.module.scss";

type SaveTaskError = "forbidden" | "generic";

function toSaveTaskError(error: unknown): SaveTaskError {
  if (isApiError(error) && error.status === 403) {
    return "forbidden";
  }

  return "generic";
}

interface EditTaskFormProps {
  taskId: string;
}

export default function EditTaskForm({ taskId }: EditTaskFormProps) {
  "use no memo";

  const t = useTranslations("EditTaskPage");
  const tNew = useTranslations("NewTaskPage");
  const router = useRouter();
  const { data: task, isPending, error } = useTaskQuery(taskId);
  const updateTask = useUpdateTaskMutation(taskId);
  const [formError, setFormError] = useState<SaveTaskError>();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const methods = useForm<NewTaskFormValues>({
    resolver: zodResolver(newTaskSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: "steps" });

  useEffect(() => {
    if (!task) return;

    reset({
      name: task.name,
      description: task.description,
      steps: task.steps.map((step) => ({
        key: step.id,
        name: step.name,
        description: step.description,
        attachments: step.attachments.map((document) => ({
          kind: "document" as const,
          id: document.id,
          name: document.name,
          size: document.size,
          extension: document.extension,
          documentType: document.type,
        })),
      })),
    });
  }, [task, reset]);

  const errorText = (key?: string) => (key ? tNew(`validation.${key}`) : undefined);

  const addStep = () => {
    const key =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());
    append({
      key,
      name: "",
      description: "",
      attachments: [],
    });
    setExpandedIds((previous) => [...previous, key]);
  };

  const removeStep = (index: number, key: string) => {
    remove(index);
    setExpandedIds((previous) => previous.filter((id) => id !== key));
  };

  if (isPending) {
    return (
      <div className={pageStyles.page}>
        <PageHeader title="…" backHref={`/tasks/${taskId}`} />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className={pageStyles.page}>
        <PageHeader title={t("notFound")} backHref={`/tasks/${taskId}`} />
        <Alert variant="error">{error ? t("loadError") : t("notFound")}</Alert>
      </div>
    );
  }

  const onSubmit = async (values: NewTaskFormValues) => {
    setFormError(undefined);

    try {
      await updateTask.mutateAsync(values);
    } catch (err) {
      setFormError(toSaveTaskError(err));

      return;
    }

    router.push(`/tasks/${taskId}`);
  };

  const onInvalid: SubmitErrorHandler<NewTaskFormValues> = (formErrors) => {
    const stepErrors = formErrors.steps;
    if (!stepErrors) return;

    const errorKeys = fields
      .map((field, index) => (stepErrors[index] ? field.key : null))
      .filter((key): key is string => Boolean(key));

    if (errorKeys.length === 0) return;

    setExpandedIds((previous) => Array.from(new Set([...previous, ...errorKeys])));
  };

  return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        <PageHeader title={t("title")} subtitle={t("subtitle")} backHref={`/tasks/${taskId}`} />

        <div className={styles.body}>
          {formError ? <Alert variant="error">{t(`saveErrors.${formError}`)}</Alert> : null}

          <TextField
            label={tNew("nameLabel")}
            hideLabel
            size="lg"
            placeholder={tNew("namePlaceholder")}
            error={errorText(errors.name?.message)}
            {...register("name")}
          />

          <TextField
            label={tNew("descriptionLabel")}
            multiline
            rows={3}
            placeholder={tNew("descriptionPlaceholder")}
            error={errorText(errors.description?.message)}
            {...register("description")}
          />

          <TaskStepsField
            fields={fields}
            expandedIds={
              expandedIds.length > 0 ? expandedIds : fields.map((field) => field.key)
            }
            onExpandedChange={setExpandedIds}
            onAddStep={addStep}
            onRemoveStep={removeStep}
          />
        </div>

        <footer className={styles.footer}>
          <Button type="button" variant="outline" onClick={() => router.push(`/tasks/${taskId}`)}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={updateTask.isPending}>
            {updateTask.isPending ? t("saving") : t("save")}
          </Button>
        </footer>
      </form>
    </FormProvider>
  );
}
