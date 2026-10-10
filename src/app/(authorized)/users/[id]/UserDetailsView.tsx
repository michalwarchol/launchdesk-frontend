"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { useDeleteUserMutation, useUserQuery } from "@/app/(authorized)/users/api";
import UserAssignmentsTable from "@/app/(authorized)/users/UserAssignmentsTable";
import Alert from "@/components/Alert";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import { isApiError } from "@/lib/api/errors";
import { parseISODate } from "@/utils/isoDate";

import styles from "../userDetail.module.scss";

type DeleteUserError = "cannotDeleteSelf" | "forbidden" | "generic";

function toDeleteUserError(error: unknown): DeleteUserError {
  if (isApiError(error)) {
    if (error.code === "cannotDeleteSelf") return "cannotDeleteSelf";
    if (error.status === 403) return "forbidden";
  }

  return "generic";
}

interface UserDetailsViewProps {
  userId: string;
  canManage: boolean;
  isSelf: boolean;
}

export default function UserDetailsView({ userId, canManage, isSelf }: UserDetailsViewProps) {
  const t = useTranslations("UserDetailsPage");
  const tUsers = useTranslations("UsersPage");
  const format = useFormatter();
  const router = useRouter();
  const { data: user, isPending, error } = useUserQuery(userId);
  const deleteUser = useDeleteUserMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<DeleteUserError>();

  if (isPending) {
    return (
      <div className={styles.page}>
        <PageHeader title="…" backHref="/users" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.page}>
        <PageHeader title={t("notFound")} backHref="/users" />
        <Alert variant="error">{error ? t("loadError") : t("notFound")}</Alert>
      </div>
    );
  }

  const displayName = `${user.firstName} ${user.lastName}`;
  const createdParsed = parseISODate(user.createdAt);
  const createdLabel = createdParsed
    ? format.dateTime(createdParsed, { dateStyle: "medium" })
    : user.createdAt;

  const closeDeleteModal = () => {
    if (deleteUser.isPending) return;
    setIsDeleteOpen(false);
    setDeleteError(undefined);
  };

  const confirmDelete = async () => {
    setDeleteError(undefined);

    try {
      await deleteUser.mutateAsync(userId);
    } catch (err) {
      setDeleteError(toDeleteUserError(err));

      return;
    }

    router.push("/users");
  };

  return (
    <div className={styles.page}>
      <PageHeader title={displayName} backHref="/users">
        {canManage ? (
          <div className={styles.headerActions}>
            <Button type="button" variant="outline" onClick={() => router.push(`/users/${userId}/edit`)}>
              {t("edit")}
            </Button>
            {!isSelf ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDeleteError(undefined);
                  setIsDeleteOpen(true);
                }}
              >
                {t("delete")}
              </Button>
            ) : null}
          </div>
        ) : null}
      </PageHeader>

      <Card title={t("profileTitle")}>
        <div className={styles.profileGrid}>
          <div className={styles.profileAvatar}>
            <Avatar src={user.avatar} title={displayName} size="lg" />
          </div>
          <div>
            <p className={styles.fieldLabel}>{t("emailLabel")}</p>
            <p className={styles.fieldValue}>{user.email}</p>
          </div>
          <div>
            <p className={styles.fieldLabel}>{t("roleLabel")}</p>
            <p className={styles.fieldValue}>{tUsers(`role.${user.role}`)}</p>
          </div>
          <div>
            <p className={styles.fieldLabel}>{t("createdAtLabel")}</p>
            <p className={styles.fieldValue}>{createdLabel}</p>
          </div>
        </div>
      </Card>

      <UserAssignmentsTable
        userId={userId}
        userDisplayName={displayName}
        sectionTitle={t("assignmentsTitle")}
        emptyMessage={t("assignmentsEmpty")}
        loadErrorMessage={t("assignmentsLoadError")}
      />

      {isDeleteOpen ? (
        <Modal
          isOpen
          onClose={closeDeleteModal}
          title={t("deleteModalTitle")}
          submitLabel={deleteUser.isPending ? t("deleteSubmitting") : t("deleteConfirm")}
          onSubmit={() => void confirmDelete()}
          isSubmitDisabled={deleteUser.isPending}
        >
          {deleteError ? <Alert variant="error">{t(`deleteErrors.${deleteError}`)}</Alert> : null}
          <p>{t("deleteModalBody", { name: displayName })}</p>
        </Modal>
      ) : null}
    </div>
  );
}
