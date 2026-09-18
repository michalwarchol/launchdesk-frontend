"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import Button from "@/components/Button";
import TextField from "@/components/TextField";

import styles from "./RegisterForm.module.scss";
import { MIN_PASSWORD_LENGTH, RegisterFormValues, registerSchema } from "./schema";

export default function RegisterForm() {
  const t = useTranslations("RegisterPage");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
    },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const onSubmit = (values: RegisterFormValues) => {
    // TODO: replace with the register API call once the backend is available
    console.info("Register:", values);
  };

  return (
    <div className={styles.register}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("userSectionTitle")}</h2>

          <div className={styles.nameRow}>
            <TextField
              label={t("firstNameLabel")}
              placeholder={t("firstNamePlaceholder")}
              autoComplete="given-name"
              error={errorText(errors.firstName?.message)}
              {...register("firstName")}
            />

            <TextField
              label={t("lastNameLabel")}
              placeholder={t("lastNamePlaceholder")}
              autoComplete="family-name"
              error={errorText(errors.lastName?.message)}
              {...register("lastName")}
            />
          </div>

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
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("organizationSectionTitle")}</h2>

          <TextField
            label={t("organizationNameLabel")}
            placeholder={t("organizationNamePlaceholder")}
            autoComplete="organization"
            error={errorText(errors.organizationName?.message)}
            {...register("organizationName")}
          />
        </section>

        <Button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>

      <p className={styles.hint}>
        {t("haveAccountHint")}{" "}
        <Link className={styles.hintLink} href="/login">
          {t("signInLink")}
        </Link>
      </p>
    </div>
  );
}
