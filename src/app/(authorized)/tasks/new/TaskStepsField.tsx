"use client";

import { useTranslations } from "next-intl";
import { Controller, FieldArrayWithId, useFormContext } from "react-hook-form";

import Accordion, { AccordionItemData } from "@/components/Accordion";
import AttachmentsField from "@/components/AttachmentsField";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";
import TextField from "@/components/TextField";

import { NewTaskFormValues } from "./schema";
import styles from "./TaskStepsField.module.scss";

interface TaskStepsFieldProps {
  fields: FieldArrayWithId<NewTaskFormValues, "steps", "id">[];
  expandedIds: string[];
  onExpandedChange: (ids: string[]) => void;
  onAddStep: () => void;
  onRemoveStep: (index: number, key: string) => void;
}

export default function TaskStepsField({
  fields,
  expandedIds,
  onExpandedChange,
  onAddStep,
  onRemoveStep,
}: TaskStepsFieldProps) {
  const t = useTranslations("NewTaskPage");
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<NewTaskFormValues>();

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const items: AccordionItemData[] = fields.map((field, index) => {
    const stepName = watch(`steps.${index}.name`);
    const stepErrors = errors.steps?.[index];
    const header = stepName?.trim() ? stepName : t("stepFallbackName", { index: index + 1 });

    return {
      id: field.key,
      hasError: Boolean(stepErrors),
      header: (
        <span className={styles.stepHeader}>
          <span className={styles.stepIndex}>{index + 1}</span>
          <span className={styles.stepTitle}>{header}</span>
        </span>
      ),
      onRemove: fields.length > 1 ? () => onRemoveStep(index, field.key) : undefined,
      content: (
        <div className={styles.stepContent}>
          <TextField
            label={t("stepNameLabel")}
            placeholder={t("stepNamePlaceholder")}
            size="md"
            error={errorText(stepErrors?.name?.message)}
            {...register(`steps.${index}.name`)}
          />

          <div className={styles.stepField}>
            <span className={styles.stepFieldLabel}>{t("stepDescriptionLabel")}</span>
            <Controller
              control={control}
              name={`steps.${index}.description`}
              render={({ field: descriptionField }) => (
                <RichTextEditor
                  value={descriptionField.value}
                  onChange={descriptionField.onChange}
                  onBlur={descriptionField.onBlur}
                  placeholder={t("stepDescriptionPlaceholder")}
                />
              )}
            />
          </div>

          <div className={styles.stepField}>
            <span className={styles.stepFieldLabel}>{t("stepAttachmentsLabel")}</span>
            <Controller
              control={control}
              name={`steps.${index}.attachments`}
              render={({ field: attachmentsField }) => (
                <AttachmentsField
                  value={attachmentsField.value}
                  onChange={attachmentsField.onChange}
                />
              )}
            />
          </div>
        </div>
      ),
    };
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>{t("stepsTitle")}</span>
        {typeof errors.steps?.message === "string" ? (
          <span className={styles.sectionError} role="alert">
            {errorText(errors.steps.message)}
          </span>
        ) : null}
      </div>

      <Accordion
        items={items}
        expandedIds={expandedIds}
        onExpandedChange={onExpandedChange}
        footer={
          <Button variant="outline" onClick={onAddStep}>
            {t("addStep")}
          </Button>
        }
      />
    </div>
  );
}
