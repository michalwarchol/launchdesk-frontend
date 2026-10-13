"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { resetPassword, ResetPasswordError } from "@/app/actions/auth";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import TextField from "@/components/TextField";

import styles from "./ResetPasswordForm.module.scss";
import { MIN_PASSWORD_LENGTH, ResetPasswordFormValues, resetPasswordSchema } from "./schema";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations("ResetPasswordPage");
  const [formError, setFormError] = useState<ResetPasswordError>();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setFormError(undefined);

    const result = await resetPassword({ token, password: values.password });

    if (result) {
      setFormError(result.error);
      return;
    }

    setDone(true);
  };

  return (
    <div className={styles.resetPassword}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{done ? t("successSubtitle") : t("subtitle")}</p>
      </header>

      {done ? (
        <Alert variant="info">{t("success")}</Alert>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {formError ? <Alert>{t(`errors.${formError}`)}</Alert> : null}

          <TextField
            label={t("passwordLabel")}
            type="password"
            placeholder={t("passwordPlaceholder", { min: MIN_PASSWORD_LENGTH })}
            autoComplete="new-password"
            error={errorText(errors.password?.message)}
            {...register("password")}
          />

          <TextField
            label={t("confirmPasswordLabel")}
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
            autoComplete="new-password"
            error={errorText(errors.confirmPassword?.message)}
            {...register("confirmPassword")}
          />

          <Button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      )}

      <Link className={styles.backLink} href="/login">
        {t("backToLogin")}
      </Link>
    </div>
  );
}
