"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Alert from "@/components/Alert";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import TextField from "@/components/TextField";
import { isApiError } from "@/lib/api/errors";

import { useCreateUserMutation } from "./api";
import styles from "./InviteUserModal.module.scss";
import { InviteUserFormValues, inviteUserSchema, USER_ROLES } from "./schema";

type InviteUserError = "emailTaken" | "forbidden" | "generic";

function toInviteUserError(error: unknown): InviteUserError {
  if (isApiError(error)) {
    if (error.code === "emailTaken") return "emailTaken";
    if (error.status === 403) return "forbidden";
  }

  return "generic";
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const t = useTranslations("UsersPage");
  const createUser = useCreateUserMutation();
  const [formError, setFormError] = useState<InviteUserError>();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { firstName: "", lastName: "", email: "", role: "user" },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const handleClose = () => {
    reset();
    setFormError(undefined);
    createUser.reset();
    onClose();
  };

  const onSubmit = async (values: InviteUserFormValues) => {
    setFormError(undefined);

    try {
      await createUser.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        role: values.role,
      });
    } catch (error) {
      setFormError(toInviteUserError(error));

      return;
    }

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("inviteModalTitle")}
      submitLabel={createUser.isPending ? t("inviteSubmitting") : t("inviteSubmit")}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitDisabled={createUser.isPending}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError ? <Alert>{t(`inviteErrors.${formError}`)}</Alert> : null}

        <TextField
          label={t("firstNameLabel")}
          autoComplete="off"
          error={errorText(errors.firstName?.message)}
          {...register("firstName")}
        />
        <TextField
          label={t("lastNameLabel")}
          autoComplete="off"
          error={errorText(errors.lastName?.message)}
          {...register("lastName")}
        />
        <TextField
          label={t("emailLabel")}
          type="email"
          autoComplete="off"
          error={errorText(errors.email?.message)}
          {...register("email")}
        />
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              label={t("roleLabel")}
              options={USER_ROLES.map((role) => ({ value: role, label: t(`role.${role}`) }))}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errorText(errors.role?.message)}
            />
          )}
        />
        {/* Lets Enter submit the form, since the modal footer button sits outside of it. */}
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
