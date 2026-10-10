"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useUpdateUserMutation, useUserQuery } from "@/app/(authorized)/users/api";
import {
  EditUserFormValues,
  editUserSchema,
  USER_ROLES,
} from "@/app/(authorized)/users/schema";
import UserAssignmentsTable from "@/app/(authorized)/users/UserAssignmentsTable";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/Select";
import TextField from "@/components/TextField";
import { isApiError } from "@/lib/api/errors";

import styles from "./EditUserForm.module.scss";

type SaveUserError = "forbidden" | "generic";

function toSaveUserError(error: unknown): SaveUserError {
  if (isApiError(error) && error.status === 403) {
    return "forbidden";
  }

  return "generic";
}

interface EditUserFormProps {
  userId: string;
}

export default function EditUserForm({ userId }: EditUserFormProps) {
  "use no memo";

  const t = useTranslations("EditUserPage");
  const tUsers = useTranslations("UsersPage");
  const router = useRouter();
  const { data: user, isPending, error } = useUserQuery(userId);
  const updateUser = useUpdateUserMutation(userId);
  const [formError, setFormError] = useState<SaveUserError>();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  }, [user, reset]);

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  if (isPending) {
    return (
      <div className={styles.page}>
        <PageHeader title="…" backHref={`/users/${userId}`} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.page}>
        <PageHeader title={t("notFound")} backHref={`/users/${userId}`} />
        <Alert variant="error">{error ? t("loadError") : t("notFound")}</Alert>
      </div>
    );
  }

  const displayName = `${user.firstName} ${user.lastName}`;

  const onSubmit = async (values: EditUserFormValues) => {
    setFormError(undefined);

    try {
      await updateUser.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        role: values.role,
      });
    } catch (err) {
      setFormError(toSaveUserError(err));

      return;
    }

    router.push(`/users/${userId}`);
  };

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <PageHeader title={t("title")} subtitle={t("subtitle")} backHref={`/users/${userId}`} />

        <div className={styles.fields}>
          {formError ? <Alert variant="error">{t(`saveErrors.${formError}`)}</Alert> : null}
          <TextField
            label={t("firstNameLabel")}
            error={errorText(errors.firstName?.message)}
            {...register("firstName")}
          />
          <TextField
            label={t("lastNameLabel")}
            error={errorText(errors.lastName?.message)}
            {...register("lastName")}
          />
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                label={t("roleLabel")}
                value={field.value}
                onChange={field.onChange}
                options={USER_ROLES.map((role) => ({
                  value: role,
                  label: tUsers(`role.${role}`),
                }))}
              />
            )}
          />
        </div>

        <footer className={styles.footer}>
          <Button type="button" variant="outline" onClick={() => router.push(`/users/${userId}`)}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || updateUser.isPending}>
            {updateUser.isPending ? t("saving") : t("save")}
          </Button>
        </footer>
      </form>

      <UserAssignmentsTable
        userId={userId}
        userDisplayName={displayName}
        showUnassign
        sectionTitle={t("assignmentsTitle")}
        emptyMessage={t("assignmentsEmpty")}
        loadErrorMessage={t("assignmentsLoadError")}
      />
    </div>
  );
}
