"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { changePassword, ChangePasswordError } from "@/app/actions/settings";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import TextField from "@/components/TextField";

import styles from "./PasswordForm.module.scss";
import { ChangePasswordFormValues, changePasswordSchema, MIN_PASSWORD_LENGTH } from "./schema";

interface PasswordFormProps {
  /** `false` for accounts that only ever signed in with Google or GitHub. */
  hasPassword: boolean;
}

export default function PasswordForm({ hasPassword }: PasswordFormProps) {
  const t = useTranslations("SettingsPage");
  const [formError, setFormError] = useState<ChangePasswordError>();
  const [isSaved, setIsSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setFormError(undefined);
    setIsSaved(false);

    const result = await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (!result.ok) {
      setFormError(result.error);

      return;
    }

    reset();
    setIsSaved(true);
  };

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t("passwordTitle")}</h2>
        {hasPassword ? <p className={styles.description}>{t("passwordDescription")}</p> : null}
      </header>

      {hasPassword ? (
        <>
          {formError ? <Alert>{t(`errors.${formError}`)}</Alert> : null}
          {isSaved ? <Alert variant="info">{t("passwordSaved")}</Alert> : null}

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label={t("currentPasswordLabel")}
              type="password"
              placeholder={t("currentPasswordPlaceholder")}
              autoComplete="current-password"
              error={errorText(errors.currentPassword?.message)}
              {...register("currentPassword")}
            />

            <TextField
              label={t("newPasswordLabel")}
              type="password"
              placeholder={t("newPasswordPlaceholder", { min: MIN_PASSWORD_LENGTH })}
              autoComplete="new-password"
              error={errorText(errors.newPassword?.message)}
              {...register("newPassword")}
            />

            <TextField
              label={t("confirmNewPasswordLabel")}
              type="password"
              placeholder={t("confirmNewPasswordPlaceholder")}
              autoComplete="new-password"
              error={errorText(errors.confirmNewPassword?.message)}
              {...register("confirmNewPassword")}
            />

            <Button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? t("passwordSubmitting") : t("passwordSubmit")}
            </Button>
          </form>
        </>
      ) : (
        <Alert variant="info">{t("errors.oauthOnly")}</Alert>
      )}
    </section>
  );
}
