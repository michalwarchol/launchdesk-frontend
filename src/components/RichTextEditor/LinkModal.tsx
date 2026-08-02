"use client";

import { useTranslations } from "next-intl";

import Modal from "@/components/Modal";
import TextField from "@/components/TextField";

import styles from "./RichTextEditor.module.scss";

export interface LinkModalValues {
  url: string;
  text: string;
}

interface LinkModalProps {
  isOpen: boolean;
  values: LinkModalValues;
  hasExistingLink: boolean;
  onChange: (values: LinkModalValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function LinkModal({
  isOpen,
  values,
  hasExistingLink,
  onChange,
  onClose,
  onSubmit,
}: LinkModalProps) {
  const t = useTranslations("RichTextEditor");

  const canRemove = hasExistingLink && values.url.trim() === "";
  const isSubmitDisabled = values.url.trim() === "" && !canRemove;
  const submitLabel = canRemove ? t("linkRemove") : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("linkModalTitle")}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      isSubmitDisabled={isSubmitDisabled}
    >
      <div className={styles.linkModal}>
        <TextField
          label={t("linkUrlLabel")}
          placeholder={t("linkUrlPlaceholder")}
          value={values.url}
          onChange={(event) => onChange({ ...values, url: event.target.value })}
        />
        <TextField
          label={t("linkTextLabel")}
          placeholder={t("linkTextPlaceholder")}
          value={values.text}
          onChange={(event) => onChange({ ...values, text: event.target.value })}
        />
      </div>
    </Modal>
  );
}
