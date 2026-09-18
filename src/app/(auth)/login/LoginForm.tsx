"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { login, LoginError } from "@/app/actions/auth";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import OAuthButtons from "@/components/OAuthButtons";
import TextField from "@/components/TextField";

import styles from "./LoginForm.module.scss";
import { LoginFormValues, loginSchema, OAuthCallbackError } from "./schema";

type FormError = LoginError | OAuthCallbackError;

interface LoginFormProps {
  next?: string;
  initialError?: OAuthCallbackError;
}

export default function LoginForm({ next, initialError }: LoginFormProps) {
  const t = useTranslations("LoginPage");
  const [formError, setFormError] = useState<FormError | undefined>(initialError);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(undefined);

    // `login` redirects on success, so a returned result always describes a failure.
    const result = await login({ email: values.email, password: values.password, next });

    if (result) setFormError(result.error);
  };

  return (
    <div className={styles.login}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>

      {formError ? <Alert>{t(`errors.${formError}`)}</Alert> : null}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label={t("emailLabel")}
          type="email"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          error={errorText(errors.email?.message)}
          {...register("email")}
        />

        <TextField
          label={t("passwordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
          error={errorText(errors.password?.message)}
          {...register("password")}
        />

        <Link className={styles.forgotLink} href="/forgot-password">
          {t("forgotPassword")}
        </Link>

        <Button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>

      <div className={styles.separator}>
        <span>{t("or")}</span>
      </div>

      <OAuthButtons next={next} disabled={isSubmitting} />

      <p className={styles.hint}>
        {t("noAccountHint")}{" "}
        <Link className={styles.hintLink} href="/register">
          {t("registerLink")}
        </Link>
      </p>
    </div>
  );
}
