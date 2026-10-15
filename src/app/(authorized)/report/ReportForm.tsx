"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { submitReport, SubmitReportError } from "@/app/actions/report";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Select from "@/components/Select";
import TextField from "@/components/TextField";

import styles from "./ReportForm.module.scss";
import { REPORT_PURPOSES, ReportFormValues, reportSchema } from "./schema";

// Opted out of the React Compiler: it caches the `register()` output, so after `reset()` the
// textarea is never re-registered and the next description is dropped from the submit.
export default function ReportForm() {
  "use no memo";

  const t = useTranslations("ReportPage");
  const [formError, setFormError] = useState<SubmitReportError>();
  const [isSent, setIsSent] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      purpose: "bug",
      description: "",
    },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const onSubmit = async (values: ReportFormValues) => {
    setFormError(undefined);
    setIsSent(false);

    const result = await submitReport(values);

    if (!result.ok) {
      setFormError(result.error);

      return;
    }

    reset({ purpose: "bug", description: "" });
    setIsSent(true);
  };

  return (
    <section className={styles.card}>
      {formError ? <Alert>{t(`errors.${formError}`)}</Alert> : null}
      {isSent ? <Alert variant="info">{t("sent")}</Alert> : null}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          control={control}
          name="purpose"
          render={({ field }) => (
            <Select
              label={t("purposeLabel")}
              options={REPORT_PURPOSES.map((purpose) => ({
                value: purpose,
                label: t(`purpose.${purpose}`),
              }))}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errorText(errors.purpose?.message)}
            />
          )}
        />
        <TextField
          label={t("descriptionLabel")}
          placeholder={t("descriptionPlaceholder")}
          multiline
          rows={8}
          error={errorText(errors.description?.message)}
          {...register("description")}
        />
        <Button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>
    </section>
  );
}
