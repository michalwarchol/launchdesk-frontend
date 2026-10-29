"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  updateNotificationPreferences,
  UpdateNotificationPreferencesError,
} from "@/app/actions/settings";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";

import styles from "./OrganizationForm.module.scss";
import {
  NotificationsFormValues,
  notificationsSchema,
} from "./schema";

interface NotificationsSectionProps {
  assignmentNotificationEmails: boolean;
}

export default function NotificationsSection({
  assignmentNotificationEmails,
}: NotificationsSectionProps) {
  "use no memo";

  const t = useTranslations("SettingsPage");
  const [formError, setFormError] = useState<UpdateNotificationPreferencesError>();
  const [isSaved, setIsSaved] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsSchema),
    mode: "onSubmit",
    defaultValues: { assignmentNotificationEmails },
  });

  const onSubmit = async (values: NotificationsFormValues) => {
    setFormError(undefined);
    setIsSaved(false);

    const result = await updateNotificationPreferences({
      assignmentNotificationEmails: values.assignmentNotificationEmails,
    });

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setIsSaved(true);
  };

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t("notificationsTitle")}</h2>
        <p className={styles.description}>{t("notificationsDescription")}</p>
      </header>

      {formError ? <Alert>{t(`errors.${formError}`)}</Alert> : null}
      {isSaved ? <Alert variant="info">{t("notificationsSaved")}</Alert> : null}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          control={control}
          name="assignmentNotificationEmails"
          render={({ field }) => (
            <Checkbox
              label={t("assignmentNotificationEmailsLabel")}
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
              onBlur={field.onBlur}
            />
          )}
        />

        <Button
          type="submit"
          className={styles.submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </form>
    </section>
  );
}
