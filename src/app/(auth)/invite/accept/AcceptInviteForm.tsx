"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { acceptInvite, AcceptInviteError } from "@/app/actions/auth";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import OAuthButtons from "@/components/OAuthButtons";
import TextField from "@/components/TextField";

import styles from "./AcceptInvite.module.scss";
import { AcceptInviteFormValues, acceptInviteSchema, MIN_PASSWORD_LENGTH } from "./schema";

interface AcceptInviteFormProps {
  token: string;
  /** Comes from the invite token, so it is shown read-only and cannot be changed here. */
  email: string;
  next?: string;
}

export default function AcceptInviteForm({ token, email, next }: AcceptInviteFormProps) {
  const t = useTranslations("AcceptInvitePage");
  const [formError, setFormError] = useState<AcceptInviteError | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(acceptInviteSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const onSubmit = async (values: AcceptInviteFormValues) => {
    setFormError(undefined);

    // `acceptInvite` redirects on success, so a returned result always describes a failure.
    const result = await acceptInvite({ token, password: values.password, next });

    if (result) setFormError(result.error);
  };

  return (
    <div className={styles.invite}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>

      {formError ? <Alert>{t(`errors.${formError}`)}</Alert> : null}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField label={t("emailLabel")} type="email" defaultValue={email} disabled />

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

      <div className={styles.separator}>
        <span>{t("or")}</span>
      </div>

      <OAuthButtons next={next} disabled={isSubmitting} />

      <p className={styles.hint}>{t("providerHint", { email })}</p>
    </div>
  );
}
