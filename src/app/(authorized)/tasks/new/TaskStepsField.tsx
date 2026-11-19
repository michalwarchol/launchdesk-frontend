"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";
import { Controller, FieldArrayWithId, useFormContext } from "react-hook-form";

import Accordion, { AccordionItemData } from "@/components/Accordion";
import AttachmentsField from "@/components/AttachmentsField";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import RichTextEditor from "@/components/RichTextEditor";
import TextField from "@/components/TextField";

import { NewTaskFormValues } from "./schema";
import styles from "./TaskStepsField.module.scss";

function StepAttachments({ index }: { index: number }) {
  const t = useTranslations("NewTaskPage");
  const labelId = useId();
  const { control } = useFormContext<NewTaskFormValues>();

  return (
    <div className={styles.stepField}>
      <span id={labelId} className={styles.stepFieldLabel}>
        {t("stepAttachmentsLabel")}
      </span>
      <Controller
        control={control}
        name={`steps.${index}.attachments`}
        render={({ field: attachmentsField }) => (
          <AttachmentsField
            value={attachmentsField.value}
            onChange={attachmentsField.onChange}
            ariaLabelledby={labelId}
          />
        )}
      />
    </div>
  );
}

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
  const stepsTitleId = useId();
  const stepsErrorId = useId();
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
            required
            label={t("stepNameLabel")}
            placeholder={t("stepNamePlaceholder")}
            size="md"
            error={errorText(stepErrors?.name?.message)}
            {...register(`steps.${index}.name`)}
          />

          <div className={styles.stepField}>
            <Controller
              control={control}
              name={`steps.${index}.description`}
              render={({ field: descriptionField }) => (
                <RichTextEditor
                  label={t("stepDescriptionLabel")}
                  value={descriptionField.value}
                  onChange={descriptionField.onChange}
                  onBlur={descriptionField.onBlur}
                  placeholder={t("stepDescriptionPlaceholder")}
                />
              )}
            />
          </div>

          <StepAttachments index={index} />

          <Controller
            control={control}
            name={`steps.${index}.notesRequired`}
            render={({ field: notesField }) => (
              <Checkbox
                label={t("notesRequiredLabel")}
                checked={notesField.value}
                onChange={(event) => notesField.onChange(event.target.checked)}
                onBlur={notesField.onBlur}
              />
            )}
          />
        </div>
      ),
    };
  });

  const stepsError = typeof errors.steps?.message === "string" ? errors.steps.message : undefined;

  return (
    <div
      className={styles.wrapper}
      role="group"
      aria-labelledby={stepsTitleId}
      aria-describedby={stepsError ? stepsErrorId : undefined}
    >
      <div className={styles.sectionHeader}>
        <span id={stepsTitleId} className={styles.sectionTitle}>
          {t("stepsTitle")}
        </span>
        {stepsError ? (
          <span id={stepsErrorId} className={styles.sectionError} role="alert">
            {errorText(stepsError)}
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
