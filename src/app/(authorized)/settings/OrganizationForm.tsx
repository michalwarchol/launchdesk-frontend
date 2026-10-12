"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { updateOrganization, UpdateOrganizationError } from "@/app/actions/settings";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import TextField from "@/components/TextField";

import styles from "./OrganizationForm.module.scss";
import { OrganizationFormValues, organizationSchema } from "./schema";

interface OrganizationFormProps {
  organizationName: string;
}

export default function OrganizationForm({ organizationName }: OrganizationFormProps) {
  "use no memo";

  const t = useTranslations("SettingsPage");
  const [formError, setFormError] = useState<UpdateOrganizationError>();
  const [isSaved, setIsSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { name: organizationName },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const onSubmit = async (values: OrganizationFormValues) => {
    setFormError(undefined);
    setIsSaved(false);

    const result = await updateOrganization({ name: values.name });

    if (!result.ok) {
      setFormError(result.error);

      return;
    }

    setIsSaved(true);
  };

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t("organizationTitle")}</h2>
        <p className={styles.description}>{t("organizationDescription")}</p>
      </header>

      {formError ? <Alert>{t(`errors.${formError}`)}</Alert> : null}
      {isSaved ? <Alert variant="info">{t("organizationSaved")}</Alert> : null}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label={t("organizationNameLabel")}
          error={errorText(errors.name?.message)}
          {...register("name")}
        />
        <Button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </form>
    </section>
  );
}
