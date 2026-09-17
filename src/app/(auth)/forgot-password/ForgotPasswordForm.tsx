"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { requestPasswordReset } from "@/app/actions/auth";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import TextField from "@/components/TextField";

import styles from "./ForgotPasswordForm.module.scss";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "./schema";

export default function ForgotPasswordForm() {
  const t = useTranslations("ForgotPasswordPage");
  const [sentTo, setSentTo] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await requestPasswordReset(values.email);
    setSentTo(values.email);
  };

  return (
    <div className={styles.forgotPassword}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{sentTo ? t("sentSubtitle") : t("subtitle")}</p>
      </header>

      {sentTo ? (
        <Alert variant="info">{t("sent", { email: sentTo })}</Alert>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label={t("emailLabel")}
            type="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            error={errorText(errors.email?.message)}
            {...register("email")}
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
