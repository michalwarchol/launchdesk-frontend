"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { User } from "@/app/(authorized)/users/types";
import { updateProfile, UpdateProfileError } from "@/app/actions/settings";
import Alert from "@/components/Alert";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Dropzone from "@/components/Dropzone";
import TextField from "@/components/TextField";

import styles from "./ProfileForm.module.scss";
import { ProfileFormValues, profileSchema } from "./schema";

/** Avatars travel inside the server action payload as base64, so they have to stay small. */
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const t = useTranslations("SettingsPage");
  const [files, setFiles] = useState<File[]>([]);
  const [pendingAvatar, setPendingAvatar] = useState<string>();
  const [avatarError, setAvatarError] = useState<string>();
  const [formError, setFormError] = useState<UpdateProfileError>();
  const [isSaved, setIsSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const errorText = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  const clearPendingAvatar = () => {
    setFiles([]);
    setPendingAvatar(undefined);
  };

  const handleFilesChange = async (next: File[]) => {
    setIsSaved(false);
    setFormError(undefined);
    setAvatarError(undefined);

    const [file] = next;

    if (!file) {
      clearPendingAvatar();

      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      clearPendingAvatar();
      setAvatarError("avatarTooLarge");

      return;
    }

    setFiles([file]);
    setPendingAvatar(await readAsDataUrl(file));
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setFormError(undefined);
    setIsSaved(false);

    const result = await updateProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      avatar: pendingAvatar,
    });

    if (!result.ok) {
      setFormError(result.error);

      return;
    }

    // The server owns the new avatar now, so the preview falls back to the revalidated user.
    clearPendingAvatar();
    reset({ firstName: values.firstName.trim(), lastName: values.lastName.trim() });
    setIsSaved(true);
  };

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t("profileTitle")}</h2>
        <p className={styles.description}>{t("profileDescription")}</p>
      </header>

      {formError ? <Alert>{t(`errors.${formError}`)}</Alert> : null}
      {isSaved ? <Alert variant="info">{t("profileSaved")}</Alert> : null}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.avatarField}>
          <span className={styles.label}>{t("avatarLabel")}</span>

          <div className={styles.avatarRow}>
            <Avatar
              size="lg"
              hideText
              src={pendingAvatar ?? user.avatar}
              title={`${user.firstName} ${user.lastName}`}
            />

            <div className={styles.avatarUpload}>
              <Dropzone
                files={files}
                onFilesChange={handleFilesChange}
                accept="image/*"
                multiple={false}
                disabled={isSubmitting}
              />
              {avatarError ? (
                <p role="alert" className={styles.error}>
                  {errorText(avatarError)}
                </p>
              ) : null}
            </div>
          </div>
        </div>

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

        <div className={styles.emailField}>
          <TextField label={t("emailLabel")} value={user.email} disabled />
          <p className={styles.hint}>{t("emailLockedHint")}</p>
        </div>

        <Button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </form>
    </section>
  );
}
