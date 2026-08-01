"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FormProvider, SubmitErrorHandler, useFieldArray, useForm } from "react-hook-form";

import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import TextField from "@/components/TextField";

import styles from "./NewTaskForm.module.scss";
import { createEmptyStep, NewTaskFormValues, newTaskSchema } from "./schema";
import TaskStepsField from "./TaskStepsField";

const INITIAL_STEP_KEY = "step-initial";

export default function NewTaskForm() {
  const t = useTranslations("NewTaskPage");
  const router = useRouter();

  const methods = useForm<NewTaskFormValues>({
    resolver: zodResolver(newTaskSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      steps: [createEmptyStep(INITIAL_STEP_KEY)],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: "steps" });

  const [expandedIds, setExpandedIds] = useState<string[]>([INITIAL_STEP_KEY]);

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const addStep = () => {
    const step = createEmptyStep();
    append(step);
    setExpandedIds((previous) => [...previous, step.key]);
  };

  const removeStep = (index: number, key: string) => {
    remove(index);
    setExpandedIds((previous) => previous.filter((id) => id !== key));
  };

  const onSubmit = (values: NewTaskFormValues) => {
    // TODO: replace with API call once the backend is available
    console.info("New task:", values);
    router.push("/tasks");
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
        <PageHeader title={t("title")} subtitle={t("subtitle")} backHref="/tasks" />

        <div className={styles.body}>
          <TextField
            label={t("nameLabel")}
            hideLabel
            size="lg"
            placeholder={t("namePlaceholder")}
            error={errorText(errors.name?.message)}
            {...register("name")}
          />

          <TextField
            label={t("descriptionLabel")}
            multiline
            rows={3}
            placeholder={t("descriptionPlaceholder")}
            error={errorText(errors.description?.message)}
            {...register("description")}
          />

          <TaskStepsField
            fields={fields}
            expandedIds={expandedIds}
            onExpandedChange={setExpandedIds}
            onAddStep={addStep}
            onRemoveStep={removeStep}
          />
        </div>

        <footer className={styles.footer}>
          <Button variant="outline" onClick={() => router.push("/tasks")}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary">
            {t("submit")}
          </Button>
        </footer>
      </form>
    </FormProvider>
  );
}
